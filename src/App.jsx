import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthValue } from "./contexts/AuthContext";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreatePost from "./pages/CreatePost/CreatePost";
import Dashboard from "./pages/Dashboard/Dashboard";
import Post from "./pages/Post/Post";
import EditPost from "./pages/EditPost/EditPost";
import Search from "./pages/Search/Search";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <AppRoutes />
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

const AppRoutes = () => {
  const { user, loading } = useAuthValue();

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      <Route path="/search" element={<Search />} />

      <Route
        path="/posts/create"
        element={user ? <CreatePost /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="/posts/:id" element={<Post />} />
      <Route
        path="/posts/edit/:id"
        element={user ? <EditPost /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;