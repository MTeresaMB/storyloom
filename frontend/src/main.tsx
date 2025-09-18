import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './providers/AppProvider'
import App from './App'
import AuthGate from './auth/AuthGate'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthGate>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthGate>
  </BrowserRouter>
)