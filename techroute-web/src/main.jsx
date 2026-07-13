import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginPage from './pages/login.jsx'
import RegisterPage from './pages/register.jsx'
import HomePage from './pages/client/homepage.jsx'
import JobDetailPage from './pages/client/job-detail.jsx'
import { Home } from 'lucide-react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RegisterPage />
  </StrictMode>,
)
