import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setDocumentLocale } from './i18n/index'

setDocumentLocale('zh-CN')

createRoot(document.getElementById('root')!).render(<App />)