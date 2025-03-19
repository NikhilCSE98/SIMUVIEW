import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/login'
import Register from './components/register'
import Forgot_Password from './components/forgot_password'
import Otp from './components/otp'
import Update_Password from './components/update_password'
import Home from './components/home'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/forgot_password' element={<Forgot_Password />}></Route>
        <Route path='/otp' element={<Otp />}></Route>
        <Route path='/update_password' element={<Update_Password />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>

      </Routes>
    </div>
  )
}

export default App
