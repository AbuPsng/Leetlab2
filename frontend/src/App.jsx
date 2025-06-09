import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Loader } from 'lucide-react'

import { useAuthStore } from './store/useAuthStore'

import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
import Layout from './layout/layout'
import AdminRoute from "./components/ui/AdminRoute"
import AddProblem from './page/AddProblem'

const App = () => {

  const { authUser, checkAuth, isChecking } = useAuthStore()

  useEffect(() => { checkAuth() }, [checkAuth])


  if (isChecking && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <Loader className='size-10 animate-spin' />
    </div>
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <Toaster />
      <Routes>

        <Route path='/' element={<Layout />} >

          <Route index element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />


          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />


          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />

          <Route element={<AdminRoute />}>

            <Route path='/add-problem' element={authUser ? <AddProblem /> : <Navigate to={"/"} />} />

          </Route>

        </Route>
      </Routes>
    </div>
  )
}

export default App
