import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/login"
import Messages from "./components/Message"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<PrivateRoute><Messages /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

// Protect chat page if user is not logged in
const PrivateRoute = ({ children }) => {
  return localStorage.getItem("jwt") ? children : <Navigate to="/" />
}

export default App
