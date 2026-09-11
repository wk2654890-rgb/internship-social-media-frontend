import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Timeline from "./pages/Timeline";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Timeline />} />
                <Route path="/users" element={<Discover />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
