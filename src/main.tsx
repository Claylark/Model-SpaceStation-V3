import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setDocumentLocale } from './i18n/index'
import { APP_CONFIG } from './config/index'

setDocumentLocale('zh-CN')
document.title = `${APP_CONFIG.meta.appName} ${APP_CONFIG.meta.version} | ${APP_CONFIG.meta.stationName}`

createRoot(document.getElementById('root')!).render(<App />)
