import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes,Route} from 'react-router'
import Todos from '../src/components/Todos.jsx'
import {Toaster} from 'react-hot-toast'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Todos />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
