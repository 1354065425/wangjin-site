import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const requirements = resolve(root, 'requirements-resume.txt')
const venvPython = resolve(root, '.venv-resume', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options })
  if (result.error || result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed${result.error ? `: ${result.error.message}` : ''}`)
  }
}

function hasReportLab(command, prefix = []) {
  const result = spawnSync(command, [...prefix, '-c', 'import reportlab'], { cwd: root, stdio: 'ignore' })
  return result.status === 0
}

const candidates = process.env.PYTHON
  ? [[process.env.PYTHON]]
  : process.platform === 'win32'
    ? [['python'], ['py', '-3'], ['python3']]
    : [['python3'], ['python']]

let selected = candidates.find(([command, ...prefix]) => hasReportLab(command, prefix))
if (!selected && existsSync(venvPython) && hasReportLab(venvPython)) selected = [venvPython]

if (!selected) {
  const base = candidates.find(([command, ...prefix]) => {
    const result = spawnSync(command, [...prefix, '--version'], { cwd: root, stdio: 'ignore' })
    return result.status === 0
  })
  if (!base) throw new Error('需要 Python 3。请安装 Python 后重新运行。')
  const [command, ...prefix] = base
  if (!existsSync(venvPython)) run(command, [...prefix, '-m', 'venv', '.venv-resume'])
  run(venvPython, ['-m', 'pip', 'install', '-r', requirements])
  selected = [venvPython]
}

const [python, ...prefix] = selected
console.log('正在根据 src/data/resume.js 生成 PDF 简历…')
run(python, [...prefix, 'scripts/generate-resume-pdf.py'], {
  env: { ...process.env, NODE_BINARY: process.execPath },
})

if (!process.argv.includes('--pdf-only')) {
  console.log('正在构建网站…')
  run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'])
}
