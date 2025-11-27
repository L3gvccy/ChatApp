import React from 'react'
import { useState } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Auth from './pages/auth/auth'
import Chat from './pages/chat/chat'
import Profile from './pages/profile/profile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route path='*' element={<Navigate to="/auth"/>} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
