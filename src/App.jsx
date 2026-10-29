import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Download,
  GitFork,
  Globe2,
  ContactRound,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react'
import { resume } from './data/resume.js'

const navigation = [
  { id: 'home', label: '首页' },
  { id: 'skills', label: '技术栈' },
  { id: 'projects', label: '项目经历' },
  { id: 'experience', label: '工作经历' },
  { id: 'education', label: '教育经历' },
  { id: 'contact', label: '联系方式' },
]

const sectionNumbers = ['01', '02', '03']

function validWebUrl(value) {
  if (!value) return false
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function SectionHeading({ id, number, eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <div className="section-marker"><span>{number}</span><span className="marker-line" /></div>
      <div className="section-heading-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const pdfUrl = `${import.meta.env.BASE_URL}${resume.pdf.path.replace(/^\/+/, '')}`
  const email = resume.contact.email.trim()
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showSocials = resume.templateMode || [resume.contact.github, resume.contact.linkedin, resume.contact.website].some(validWebUrl)

  useEffect(() => {
    document.title = resume.templateMode
      ? '个人简历 · 作品集模板'
      : `${resume.profile.name} · 个人简历`
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      resume.templateMode
        ? '一份简洁、响应式的个人简历与作品集网站模板。'
        : `${resume.profile.name}的个人简历与作品集。${resume.profile.introduction}`.slice(0, 155),
    )
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-18% 0px -58% 0px', threshold: [0, 0.2, 0.5] },
    )
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">跳到主要内容</a>
      {resume.templateMode && (
        <div className="template-banner">
          <span className="banner-dot" aria-hidden="true" />
          <span>演示模板 · 所有个人资料均为占位内容，请在 <code>src/data/resume.js</code> 中替换</span>
        </div>
      )}

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" onClick={() => setMenuOpen(false)} aria-label="返回首页">
            <span className="brand-mark">{resume.profile.monogram.slice(0, 2)}</span>
            <span className="brand-text">PORTFOLIO<span className="brand-period">.</span></span>
          </a>

          <nav id="mobile-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="主导航">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? 'active' : ''}
                aria-current={activeSection === item.id ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a className="mobile-resume-link" href={pdfUrl} download={resume.pdf.downloadName} onClick={() => setMenuOpen(false)}>
              下载 PDF 简历 <Download size={16} strokeWidth={1.8} />
            </a>
          </nav>

          <a className="header-resume" href={pdfUrl} download={resume.pdf.downloadName}>
            下载简历 <ArrowUpRight size={16} strokeWidth={1.8} />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero section-anchor" id="home" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker"><span className="kicker-line" /> PERSONAL RESUME / {new Date().getFullYear()}</div>
              <h1 id="hero-title">
                <span className="greeting">{resume.profile.greeting}</span>
                <span className="hero-name">{resume.profile.name}<span className="name-period">.</span></span>
              </h1>
              <p className="hero-tagline">{resume.profile.tagline}</p>
              <p className="hero-intro">{resume.profile.introduction}</p>
              <div className="hero-meta" aria-label="个人信息">
                <span><span className="meta-dot" aria-hidden="true" />{resume.profile.role}</span>
                <span><MapPin size={16} strokeWidth={1.8} />{resume.profile.location}</span>
                <span className="meta-status"><span className="status-ring" aria-hidden="true" />{resume.profile.availability}</span>
              </div>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">查看项目 <ArrowUpRight size={18} strokeWidth={1.8} /></a>
                <a className="button button-secondary" href={pdfUrl} download={resume.pdf.downloadName}>下载 PDF 简历 <Download size={18} strokeWidth={1.8} /></a>
              </div>
              {resume.templateMode && <p className="pdf-hint">下载文件也是示例版，请在发布前替换 <code>public/resume.pdf</code>。</p>}
            </div>

            <div className="hero-art" aria-label="装饰性个人档案图形">
              <div className="art-topline"><span>YOUR STORY</span><span>NO. 001</span></div>
              <div className="art-orbit art-orbit-one" />
              <div className="art-orbit art-orbit-two" />
              <div className="art-cross" aria-hidden="true">+</div>
              <div className="art-monogram">{resume.profile.monogram}</div>
              <div className="art-bottom">
                <span className="art-caption">A SPACE FOR<br />YOUR NEXT CHAPTER</span>
                <span className="art-arrow"><ArrowUpRight size={22} strokeWidth={1.4} /></span>
              </div>
            </div>
          </div>
          <div className="container hero-bottom">
            <a href="#skills" className="scroll-cue">向下探索 <ArrowDown size={15} strokeWidth={1.8} /></a>
            <span>SCROLL TO EXPLORE</span>
          </div>
        </section>

        <section className="about-band" aria-labelledby="about-title">
          <div className="container about-band-inner">
            <h2 className="eyebrow" id="about-title">ABOUT ME</h2>
            <p>{resume.profile.about}</p>
            <span className="about-spark" aria-hidden="true">✳</span>
          </div>
        </section>

        <section className="skills-section section-anchor section-spacing" id="skills" aria-labelledby="skills-title">
          <div className="container">
            <SectionHeading
              id="skills-title"
              number="01"
              eyebrow="SKILLS & TOOLS"
              title="技术栈与专长"
              description={resume.templateMode ? '按方向整理你真正使用过的技能，让读者快速了解你的工作方式。' : '我的常用技术、工具与专业方向。'}
            />
            <div className="skills-grid">
              {resume.skills.map((group, index) => (
                <article className="skill-card" key={`${group.title}-${index}`}>
                  <div className="skill-card-top"><span>{sectionNumbers[index] || String(index + 1).padStart(2, '0')}</span><span className="skill-symbol" aria-hidden="true">↗</span></div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <ul className="skill-list" aria-label={`${group.title}技能列表`}>
                    {group.items.map((skill, skillIndex) => <li key={`${skill}-${skillIndex}`}>{skill}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="projects-section section-anchor section-spacing" id="projects" aria-labelledby="projects-title">
          <div className="container">
            <SectionHeading
              id="projects-title"
              number="02"
              eyebrow="SELECTED WORK"
              title="项目经历"
              description={resume.templateMode ? '选择最能体现你思考、行动与结果的项目。示例卡片可自由增删。' : '视觉检测、中文语音识别与边缘设备接入相关工作项目。'}
            />
            <div className="project-list">
              {resume.projects.map((project, index) => (
                <article className="project-card" key={`${project.title}-${index}`}>
                  <div className={`project-art project-art-${index % 3 + 1}`} aria-hidden="true">
                    <span className="project-art-label">PROJECT / {String(index + 1).padStart(2, '0')}</span>
                    <span className="project-art-shape"><span /></span>
                    <span className="project-art-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="project-content">
                    <div className="project-overline"><span>{project.category}</span><span>{project.year}</span></div>
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <p className="project-contribution">{project.contribution}</p>
                    <ul className="tag-list" aria-label="使用技术">
                      {project.technologies.map((technology, techIndex) => <li key={`${technology}-${techIndex}`}>{technology}</li>)}
                    </ul>
                    {validWebUrl(project.url) ? (
                      <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">
                        查看项目 <ArrowUpRight size={17} strokeWidth={1.8} />
                      </a>
                    ) : resume.templateMode ? <span className="project-link project-link-muted">项目链接待填写 <ArrowUpRight size={17} strokeWidth={1.8} /></span> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience-section section-anchor section-spacing" id="experience" aria-labelledby="experience-title">
          <div className="container">
            <SectionHeading
              id="experience-title"
              number="03"
              eyebrow="EXPERIENCE"
              title="工作经历"
              description={resume.templateMode ? '把职责写具体，把真实成果写清楚。也可以替换为实习或实践经历。' : '我的任职经历与主要职责。'}
            />
            <div className="experience-list">
              {resume.experience.map((job, index) => (
                <article className="experience-item" key={`${job.company}-${index}`}>
                  <div className="experience-time"><span className="timeline-dot" aria-hidden="true" />{job.period}</div>
                  <div className="experience-content">
                    <div className="experience-title-row"><h3>{job.role}</h3>{job.location && <span>{job.location}</span>}</div>
                    <p className="company-name">{job.company}</p>
                    <ul>
                      {job.details.map((detail, detailIndex) => <li key={detailIndex}>{detail}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="education-section section-anchor section-spacing" id="education" aria-labelledby="education-title">
          <div className="container">
            <SectionHeading
              id="education-title"
              number="04"
              eyebrow="EDUCATION"
              title="教育经历"
              description="专业学习与技术基础。"
            />
            <div className="education-list">
              {resume.education.map((school, index) => (
                <article className="education-card" key={`${school.school}-${index}`}>
                  <div className="education-date">{school.period}</div>
                  <div className="education-main">
                    <h3>{school.school}</h3>
                    <p className="education-major">{school.degree} · {school.major}</p>
                    <p className="education-description">{school.description}</p>
                  </div>
                  <span className="education-icon" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-anchor" id="contact" aria-labelledby="contact-title">
          <div className="container contact-inner">
            <div className="contact-heading">
              <span className="contact-eyebrow">05 / GET IN TOUCH</span>
              <h2 id="contact-title">{resume.contact.heading}</h2>
              <p>{resume.contact.message}</p>
            </div>
            <div className="contact-actions">
              {hasEmail ? (
                <a className="contact-mail" href={`mailto:${email}`}><Mail size={20} strokeWidth={1.7} /><span>{email}</span><ArrowUpRight size={21} strokeWidth={1.7} /></a>
              ) : (
                <div className="contact-mail contact-mail-empty"><Mail size={20} strokeWidth={1.7} /><span>邮箱地址待填写</span><ArrowUpRight size={21} strokeWidth={1.7} /></div>
              )}
              {showSocials && <div className="social-links">
                <SocialLink href={resume.contact.github} icon={GitFork} label="GitHub" showPlaceholder={resume.templateMode} />
                <SocialLink href={resume.contact.linkedin} icon={ContactRound} label="LinkedIn" showPlaceholder={resume.templateMode} />
                <SocialLink href={resume.contact.website} icon={Globe2} label="个人网站" showPlaceholder={resume.templateMode} />
              </div>}
            </div>
            <span className="contact-decoration" aria-hidden="true">✳</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} {resume.profile.name}</span>
          <span>{resume.templateMode ? '这是一份可替换内容的演示模板' : resume.profile.role}</span>
          <a href="#home">回到顶部 <ArrowRight size={15} strokeWidth={1.8} /></a>
        </div>
      </footer>
    </>
  )
}

function SocialLink({ href, icon: Icon, label, showPlaceholder }) {
  if (!validWebUrl(href)) {
    return showPlaceholder ? <span className="social-link social-link-empty" title={`${label} 链接待填写`}><Icon size={18} strokeWidth={1.7} />{label}<span>待填写</span></span> : null
  }
  return <a className="social-link" href={href} target="_blank" rel="noopener noreferrer"><Icon size={18} strokeWidth={1.7} />{label}<ArrowUpRight size={15} strokeWidth={1.8} /></a>
}

export default App
