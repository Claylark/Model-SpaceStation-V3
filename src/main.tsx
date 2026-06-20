import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setDocumentLocale } from './i18n/index'

// 初始化 RTL 方向设置
setDocumentLocale('zh-CN')

createRoot(document.getElementById('root')!).render(<App />)