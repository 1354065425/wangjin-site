# 王金的 React 个人简历网站

网站和下载版 PDF 共用一份内容：[`src/data/resume.js`](src/data/resume.js)。修改姓名、简介、技能、项目、工作经历、教育和联系方式时，只需编辑这个文件。

## 一次设置

安装 Node.js 22.12 或更新版本，以及 Python 3。首次在项目目录运行：

```powershell
npm install
```

如电脑尚未安装 PDF 依赖，生成脚本会自动创建 `.venv-resume` 虚拟环境并安装 `requirements-resume.txt` 中的 ReportLab；以后会复用它。

## 修改后同步网站和 PDF

1. 编辑 `src/data/resume.js`。项目内容放在 `projects`，任职经历放在 `experience`；`description` 和 `contribution` 会直接出现在网站和 PDF 中。请只填写可核实的经历和成果。
2. 双击项目根目录的 **`生成网站和PDF.cmd`**，或在项目目录运行：

   ```powershell
   npm run build
   ```

这一个命令会先从 `resume.js` 生成 `public/resume.pdf`，再构建网站到 `dist/`。网站读取同一份 `resume.js`，因此两边内容会同步。只想重新生成 PDF 可运行 `npm run pdf`；本地预览网站可运行 `npm run dev`。

`greeting`、`tagline`、`monogram`、`contact.heading` 和 `contact.message` 是网页展示文案；PDF 收录姓名、简介、技能、工作经历、教育、项目、求职信息和联系方式。PDF 标题和下载文件名分别由 `profile.name`、`pdf.downloadName` 控制。

PDF 文件名由 `resume.js` 中的 `pdf.path` 决定，网站下载按钮也读取这个路径。修改资料后无需再编辑 PDF 生成脚本。

## 更新 GitHub Pages

把修改后的 `resume.js` 推送到 `main` 分支即可。仓库的 GitHub Actions 会自动安装依赖、重新生成 PDF、构建网站并发布 `dist/`；你也可以在 Actions 中手动运行 **Deploy to GitHub Pages**。即使只在 GitHub 网页上修改 `resume.js`，线上 PDF 也会在这次部署时同步更新。

网站地址：<https://1354065425.github.io/wangjin-site/>

## 主要文件

- `src/data/resume.js`：唯一的简历内容来源。
- `scripts/export-resume.mjs`：将简历资料提供给 PDF 生成器。
- `scripts/generate-resume-pdf.py`：根据资料排版 PDF，内容增减时自动分页。
- `scripts/build-resume.mjs`：一个命令串联 PDF 生成和网站构建。
- `生成网站和PDF.cmd`：Windows 上可双击的入口。
- `assets/fonts/`：PDF 使用的开源中文字体及许可。
- `public/resume.pdf`：本地生成的下载版简历。
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署。
