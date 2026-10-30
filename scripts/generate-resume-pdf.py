"""Render public/resume.pdf from the same src/data/resume.js used by React."""

import json
import os
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent.parent
PUBLIC = (ROOT / "public").resolve()
GREEN = colors.HexColor("#2E4438")
INK = colors.HexColor("#25352B")
MUTED = colors.HexColor("#5E6C62")
ACCENT = colors.HexColor("#D47C5F")
PALE = colors.HexColor("#E8EDE7")
LINE = colors.HexColor("#DCE2D9")
W, H = A4


def load_resume():
    node = os.environ.get("NODE_BINARY", "node")
    result = subprocess.run(
        [node, str(ROOT / "scripts" / "export-resume.mjs")],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    data = json.loads(result.stdout)
    if not isinstance(data.get("profile"), dict):
        raise ValueError("resume.js 中缺少 profile 对象")
    return data


def register_fonts():
    # Bundle an open CJK font so local builds and GitHub Actions render alike.
    font_dir = ROOT / "assets" / "fonts"
    regular = font_dir / "NotoSansSC-400.ttf"
    bold = font_dir / "NotoSansSC-600.ttf"
    for path in (regular, bold):
        if not path.is_file():
            raise FileNotFoundError(f"缺少 PDF 字体文件: {path}")
    pdfmetrics.registerFont(TTFont("ResumeRegular", str(regular)))
    pdfmetrics.registerFont(TTFont("ResumeBold", str(bold)))
    return "ResumeRegular", "ResumeBold"


DATA = load_resume()
FONT, BOLD = register_fonts()
PROFILE = DATA["profile"]
PDF_PATH = str(DATA.get("pdf", {}).get("path") or "resume.pdf").lstrip("/")
OUTPUT = (PUBLIC / PDF_PATH).resolve()
if not OUTPUT.is_relative_to(PUBLIC) or OUTPUT.suffix.lower() != ".pdf":
    raise ValueError("pdf.path 必须是 public 目录内的 PDF 文件路径")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)


def plain(value):
    return escape(str(value or "")).replace("\n", "<br/>")


def style(name, size, leading, color=INK, font=FONT, **extra):
    options = dict(fontName=font, fontSize=size, leading=leading,
                   textColor=color, wordWrap="CJK", alignment=TA_LEFT, spaceAfter=0)
    options.update(extra)
    return ParagraphStyle(name, **options)


S = {
    "eyebrow": style("eyebrow", 8.5, 12, ACCENT, BOLD, spaceBefore=13, spaceAfter=7),
    "section": style("section", 14, 20, GREEN, BOLD, spaceBefore=14, spaceAfter=8, keepWithNext=True),
    "body": style("body", 9.4, 15.2, MUTED, spaceAfter=6),
    "bullet": style("bullet", 9.2, 14.7, MUTED, leftIndent=10, spaceAfter=4),
    "item": style("item", 10.7, 16, INK, BOLD, spaceBefore=9, spaceAfter=4, keepWithNext=True),
    "meta": style("meta", 8.4, 13, GREEN, spaceAfter=5),
    "tags": style("tags", 8.3, 13, GREEN, spaceBefore=3, spaceAfter=8),
    "skillTitle": style("skillTitle", 9.6, 14, GREEN, BOLD, spaceAfter=3),
    "skillBody": style("skillBody", 8.6, 13.5, MUTED),
}


def paragraph(value, kind="body"):
    return Paragraph(plain(value), S[kind])


def bullets(items):
    return [Paragraph(f'<font color="#D47C5F">•</font>  {plain(item)}', S["bullet"])
            for item in items if str(item or "").strip()]


def section(title):
    return [paragraph(title, "section"), HRFlowable(width="100%", thickness=0.7, color=LINE, spaceAfter=5)]


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.rect(0, H - 108, W, 108, fill=1, stroke=0)
    canvas.setFillColor(ACCENT)
    canvas.rect(48, H - 38, 24, 2, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont(BOLD, 22)
    canvas.drawString(48, H - 74, str(PROFILE.get("name") or "个人简历"))
    canvas.setFont(FONT, 9.4)
    canvas.drawString(48, H - 94, str(PROFILE.get("role") or ""))
    email = str(DATA.get("contact", {}).get("email") or "")
    if email:
        canvas.setFont(FONT, 8.4)
        canvas.drawRightString(W - 48, H - 68, email)
    canvas.setStrokeColor(LINE)
    canvas.line(48, 48, W - 48, 48)
    canvas.setFillColor(MUTED)
    canvas.setFont(FONT, 8)
    canvas.drawString(48, 32, f'{PROFILE.get("name", "")} / 个人简历')
    canvas.drawRightString(W - 48, 32, f"{doc.page:02d}")
    canvas.restoreState()


story = []
story += section("个人简介")
profile_meta = "  |  ".join(filter(None, [PROFILE.get("location"), PROFILE.get("availability")]))
if profile_meta:
    story.append(paragraph(profile_meta, "meta"))
if PROFILE.get("introduction"):
    story.append(paragraph(PROFILE["introduction"]))
if PROFILE.get("about") and PROFILE["about"] != PROFILE.get("introduction"):
    story.append(paragraph(PROFILE["about"]))
contact = DATA.get("contact") or {}
contact_links = "  |  ".join(
    f'{label}：{contact[key]}'
    for label, key in (("GitHub", "github"), ("LinkedIn", "linkedin"), ("网站", "website"))
    if contact.get(key)
)
if contact_links:
    story.append(paragraph(contact_links, "meta"))

skills = DATA.get("skills") or []
if skills:
    story += section("技术栈")
    cells = []
    for group in skills:
        lines = [paragraph(group.get("title"), "skillTitle")]
        if group.get("description"):
            lines.append(paragraph(group["description"], "skillBody"))
        if group.get("items"):
            lines.append(paragraph(" · ".join(map(str, group["items"])), "skillBody"))
        cells.append(lines)
    rows = [cells[i:i + 2] + ([""] if len(cells[i:i + 2]) == 1 else [])
            for i in range(0, len(cells), 2)]
    table = Table(rows, colWidths=[245, 245], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, colors.white),
    ]))
    story.append(table)

experience = DATA.get("experience") or []
if experience:
    story += section("工作经历")
    for job in experience:
        heading = " · ".join(filter(None, [job.get("company"), job.get("role")]))
        story.append(paragraph(heading, "item"))
        meta = "  |  ".join(filter(None, [job.get("period"), job.get("location")]))
        if meta:
            story.append(paragraph(meta, "meta"))
        story.extend(bullets(job.get("details") or []))

education = DATA.get("education") or []
if education:
    story += section("教育经历")
    for school in education:
        heading = " · ".join(filter(None, [school.get("school"), school.get("degree"), school.get("major")]))
        story.append(paragraph(heading, "item"))
        if school.get("period"):
            story.append(paragraph(school["period"], "meta"))
        if school.get("description"):
            story.append(paragraph(school["description"]))

projects = DATA.get("projects") or []
if projects:
    story.append(PageBreak())
    story += section("项目经历")
    for project in projects:
        block = [paragraph(project.get("title"), "item")]
        meta = "  |  ".join(filter(None, [project.get("category"), project.get("year")]))
        if meta:
            block.append(paragraph(meta, "meta"))
        block.extend(bullets([project.get("description"), project.get("contribution")]))
        if project.get("technologies"):
            block.append(paragraph(" · ".join(map(str, project["technologies"])), "tags"))
        if project.get("url"):
            block.append(paragraph(project["url"], "meta"))
        block.append(HRFlowable(width="100%", thickness=0.6, color=LINE, spaceBefore=3, spaceAfter=6))
        story.append(KeepTogether(block))

doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=48,
    rightMargin=48,
    topMargin=126,
    bottomMargin=62,
    title=f'{PROFILE.get("name", "")} - 个人简历',
    author=str(PROFILE.get("name") or ""),
)
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")
