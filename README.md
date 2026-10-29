# 王金的 React 个人简历网站

浅色、简约、响应式的单页个人简历与作品集。包含首页、技术栈、项目经历、工作经历、教育经历、联系方式和 PDF 简历下载。项目基于 React + Vite，适合免费部署在 GitHub Pages。

> **内容依据你提供的《王金简历.pdf》、本轮补充以及相关项目记录整理。** 成都森川科技的任职经历及视频监控、隧道漏缆识别工作项目依据原简历；Whisper 微调、Ultralytics YOLO 和 Jetson 工作项目依据你补充的信息及相关项目记录整理。后面三项未提供所属公司与项目时间，因此页面没有自行补写。网站和下载版 PDF 只展示邮箱，不展示原件中的手机号、微信号、年龄、薪资或照片。原件写的“工作时长 3 年”与 `2020.12—至今` 的任职日期不一致，因此本站只保留任职日期。发布前请核对在职状态、邮箱和项目描述。

## 运行项目

准备 Node.js 22.12 或更新版本，然后在项目根目录运行：

```bash
npm install
npm run dev
```

终端会给出本地地址，通常是 `http://localhost:5173/`。构建和本地预览：

```bash
npm run build
npm run preview
```

构建产物在 `dist/`。项目已包含 `package-lock.json`，GitHub Actions 会用 `npm ci` 安装与锁文件一致的依赖。

## 更新个人信息

打开 **`src/data/resume.js`**。个人资料都集中在这里：

| 配置 | 页面内容 |
| --- | --- |
| `profile` | 姓名、缩写、职业方向、城市、首页介绍和自我介绍 |
| `skills` | 技术方向、说明和技能标签；可增删分组与标签 |
| `projects` | 项目名称、类型、年份、背景、个人贡献、技术和项目链接 |
| `experience` | 职位、公司、日期、地点和工作内容 |
| `education` | 学校、学历、专业、时间和相关技能 |
| `contact` | 联系文案、邮箱、GitHub、LinkedIn 和个人网站 |
| `pdf` | PDF 文件路径及下载后的文件名 |

项目没有提供公开链接，因此当前不显示项目跳转按钮；在 `projects[].url` 中填写完整的 `https://...` 地址即可显示。GitHub、LinkedIn 和个人网站链接也留空，页面不会展示虚构地址。`templateMode` 已设为 `false`。

### PDF 简历

网站上的下载按钮会下载 **`public/resume.pdf`**，目前是根据工作经历和工作项目重新排版的版本。**修改 `src/data/resume.js` 不会自动更新 PDF**，所以两者需要分别维护。若要改文件名或路径，修改 `resume.js` 的 `pdf.path`；文件仍应放在 `public/` 中，例如 `public/my-resume.pdf` 对应 `path: 'my-resume.pdf'`。

## 免费部署到 GitHub Pages

项目已经包含 `.github/workflows/deploy.yml`。它会在推送到 `main` 分支后自动构建并发布 `dist/`，也可以在 GitHub 的 **Actions** 页面手动触发。

### 1. 创建仓库并上传项目

在 GitHub 创建一个**公开仓库**，例如 `resume-site`。解压本项目后，在项目根目录运行以下命令；把地址中的用户名和仓库名改成你的：

```bash
git init
git add .
git commit -m "Initial resume site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resume-site.git
git push -u origin main
```

也可以直接通过 GitHub 网页上传**项目根目录中的所有文件和隐藏文件夹**，尤其是 `.github/workflows/deploy.yml`。不需要上传 `node_modules/` 或 `dist/`。

### 2. 打开 Pages 的 Actions 发布方式

进入仓库的 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。若此时工作流已经运行，可到 **Actions** 页面查看运行状态；必要时打开 **Deploy to GitHub Pages** 并点击 **Run workflow**。

首次发布成功后，页面地址一般是：

```text
https://YOUR_USERNAME.github.io/resume-site/
```

如果仓库名正好是 `YOUR_USERNAME.github.io`，地址则是 `https://YOUR_USERNAME.github.io/`。

### 3. 后续更新

修改文件并推送到 `main`，GitHub Actions 会重新发布。仓库名称变化时，`vite.config.js` 会在 GitHub Actions 中自动推导正确的资源前缀，PDF 下载路径也会跟随更新。

如果以后绑定**自定义域名**，可在 `.github/workflows/deploy.yml` 的 `Build` 步骤设置环境变量 `VITE_BASE_PATH: /`，再按 GitHub Pages 的域名设置完成绑定。

### 常见问题

- **页面空白或资源 404**：检查 Actions 构建是否成功、仓库 Pages 的 Source 是否为 GitHub Actions，并确认访问地址包含正确仓库名。
- **PDF 没有同步更新**：替换 `public/resume.pdf` 后提交并推送；只改页面配置不会修改 PDF。
- **项目链接没有显示**：原简历未提供公开网址；在 `src/data/resume.js` 填写完整的 `https://...` 地址。
- **部署未触发**：确认代码推送到 `main` 分支；也可在 Actions 页面手动运行。

GitHub Free 的公开仓库可使用 GitHub Pages。Pages 托管本项目的静态网页无需付费；购买自定义域名是可选费用。参考：[Vite 静态部署指南](https://vite.dev/guide/static-deploy)、[GitHub Pages 发布源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[GitHub Pages 创建站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 主要文件

```text
react-resume-website/
├─ .github/workflows/deploy.yml  # GitHub Pages 自动发布
├─ public/resume.pdf             # 根据已提供经历整理的下载版 PDF
├─ src/data/resume.js            # 集中维护的个人信息
├─ src/App.jsx                   # 页面结构和交互
├─ src/styles.css                # 视觉样式与响应式布局
├─ vite.config.js                # Pages 路径适配
└─ package.json
```
