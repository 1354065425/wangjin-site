import { defineConfig } from 'vite'
import { resume } from './src/data/resume.js'

// GitHub Actions 会提供仓库信息，因此普通仓库站点自动使用 /仓库名/。
// 用户名.github.io 仓库、本地开发和自定义域名默认使用 /。
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const owner = process.env.GITHUB_REPOSITORY_OWNER
const isUserSite = repositoryName && owner && repositoryName.toLowerCase() === `${owner.toLowerCase()}.github.io`
const githubBase = process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isUserSite
  ? `/${repositoryName}/`
  : '/'

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })[character])
}

const pageTitle = resume.templateMode ? '个人简历 · 作品集模板' : `${resume.profile.name} · 个人简历`
const pageDescription = resume.templateMode
  ? '一份简洁、响应式的个人简历与作品集网站模板。'
  : `${resume.profile.name}的个人简历与作品集。${resume.profile.introduction}`.slice(0, 155)

export default defineConfig({
  base: process.env.VITE_BASE_PATH || githubBase,
  plugins: [{
    name: 'resume-page-metadata',
    transformIndexHtml(html) {
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(" \/>)/, (_, before, after) => `${before}${escapeHtml(pageDescription)}${after}`)
    },
  }],
})
