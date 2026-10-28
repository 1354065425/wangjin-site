/**
 * 王金的简历资料。工作与教育信息依据用户提供的《王金简历.pdf》；
 * Whisper、Ultralytics YOLO 和 Jetson 实践依据用户补充及其本地项目记录整理。
 * 修改这里即可更新网站；PDF 下载文件需另行同步更新 public/resume.pdf。
 * 原简历的“工作时长 3 年”与任职日期不一致，因此未展示总年限。
 */
export const resume = {
  templateMode: false,
  profile: {
    name: '王金',
    monogram: 'WJ',
    role: 'Python · 视觉算法 · 语音识别',
    location: '期望城市：成都',
    availability: '求职方向：Python',
    greeting: '你好，我是',
    tagline: '从数据到模型，连接真实场景。',
    introduction: '在视觉工作项目中负责图像预处理、检测与分类模型训练及 TensorRT 推理模型转换；另围绕中文语音识别、Ultralytics YOLO 和 Jetson 设备数据接入开展技术实践。',
    about: '在视觉工作项目中承担数据标注、模型训练与推理模型转换；在语音识别技术实践中构建音频预处理、Whisper 微调、CER 评估和推理服务流程，并持续探索视觉模型与设备接口的衔接。',
  },
  skills: [
    {
      title: '视觉算法',
      description: '目标检测、图像分类与关键点任务实践。',
      items: ['OpenCV', 'PyTorch', 'YOLOX', 'Ultralytics YOLO11', 'ResNet50'],
    },
    {
      title: '语音识别',
      description: '中文音频处理、Whisper 微调与识别评估。',
      items: ['Whisper-small', 'Transformers', 'Silero VAD', 'Label Studio', 'CER 评估'],
    },
    {
      title: '推理与设备接入',
      description: '模型转换、推理服务与 Jetson 数据接收接口原型。',
      items: ['TensorRT', 'CTranslate2', 'Faster-Whisper', 'Jetson', '面向 C++ 的模型转换'],
    },
    {
      title: '开发与数据工具',
      description: 'Python 服务开发、数据整理与数据库基础。',
      items: ['Python', 'FastAPI', 'Django', 'MySQL', 'JSONL'],
    },
  ],
  projects: [
    {
      title: '中文语音识别与 Whisper 微调',
      category: '语音识别 / 模型微调',
      year: '技术实践',
      description: '面向中文语音识别任务，搭建音频重采样、VAD 切分、标注转换及训练/验证数据构建流程；基于 Whisper-small 进行微调，并使用字符错误率（CER）开展验证。',
      contribution: '将 Label Studio 标注转换为 JSONL 数据，结合 Faster-Whisper 与 CTranslate2 构建推理服务，并适配 CPU/CUDA 运行环境。',
      technologies: ['Whisper-small', 'Transformers', 'Silero VAD', 'CTranslate2', 'FastAPI'],
      url: '',
    },
    {
      title: '视频监控目标检测',
      category: '视频监控 / 目标检测',
      year: '工作项目',
      description: '负责视频监控场景下 YOLOX 目标检测模块的工程模型，覆盖样本标注、模型训练与检测流程构建。',
      contribution: '将 Torch 模型转换为 TensorRT 加速推理模型，为 C++ 端部署提供可用模型。',
      technologies: ['YOLOX', 'PyTorch', 'TensorRT', 'C++ 部署'],
      url: '',
    },
    {
      title: '隧道漏缆状态识别',
      category: '隧道场景 / 分类与检测',
      year: '工作项目',
      description: '针对隧道场景识别需求，使用 ResNet50 建立隧道内外分类模型，并基于 YOLOX 检测漏缆线夹状态。',
      contribution: '完成检测模型的 Torch 至 TensorRT 转换，支持 C++ 端推理集成。',
      technologies: ['ResNet50', 'YOLOX', 'PyTorch', 'TensorRT'],
      url: '',
    },
    {
      title: 'Ultralytics YOLO 视觉任务实践',
      category: '视觉模型 / 检测与关键点',
      year: '技术实践',
      description: '围绕 YOLO11 图像检测与关键点任务，梳理推理结果的 YOLO TXT 标签导出，以及 LabelMe 关键点标注、visibility 字段和可视化检查流程。',
      contribution: '准备室内外分类数据及 YOLO11 分类训练配置，形成从数据整理到模型调用的实践方案。',
      technologies: ['Ultralytics YOLO11', 'YOLO TXT', '关键点标注', '图像分类'],
      url: '',
    },
    {
      title: 'Jetson 边缘设备数据接入',
      category: '边缘设备 / 接口原型',
      year: '技术实践',
      description: '围绕 Jetson 开发板的数据回传需求，编写 FastAPI 接收接口原型，定义设备时间、状态、详情与 Base64 图像字段。',
      contribution: '设计图像解码与保存流程，为后续设备联调和视觉服务集成准备接口基础。',
      technologies: ['Jetson', 'FastAPI', 'Python', 'Base64 图像'],
      url: '',
    },
  ],
  experience: [
    {
      role: 'Python',
      company: '成都森川科技股份有限公司',
      period: '2020.12 — 至今',
      location: '',
      details: [
        '使用 OpenCV 与 Python 进行图像数据预处理。',
        '使用 PyTorch 与 Python 进行模型训练。',
        '在视频监控与漏缆检测项目中承担目标检测、分类模型和推理模型转换相关工作。',
      ],
    },
  ],
  education: [
    {
      school: '四川科技职业学院',
      degree: '大专',
      major: '大数据技术与应用',
      period: '2018 — 2021',
      description: 'Python 编程；熟悉 Django、MySQL。',
    },
  ],
  contact: {
    heading: '期待与你交流。',
    message: '如果你有 Python、计算机视觉、语音识别或边缘设备相关机会，欢迎通过邮件联系我。',
    email: '1354065425@qq.com',
    github: '',
    linkedin: '',
    website: '',
  },
  pdf: {
    path: 'resume.pdf',
    downloadName: '王金-简历.pdf',
  },
}
