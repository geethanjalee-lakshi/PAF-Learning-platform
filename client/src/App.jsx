import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar"
import { AuthProvider } from "./context/AuthContext"
import CreatePost from './pages/CreatePost'
import AllPosts from './pages/AllPosts'
import MyPosts from './pages/MyPosts'
import UpdatePost from './pages/UpdatePost'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/all-posts" element={<AllPosts />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App


