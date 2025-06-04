// src/App.jsx

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import AddPhoto from "./components/AddPhoto"; // ← import mới
import LoginRegister from "./components/LoginRegister";

const BACKEND_URL = "https://d78t48-8081.csb.app"; // hoặc "http://localhost:8081"

const App = () => {
  // Lấy user + token từ localStorage (nếu có)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Khi user hoặc token thay đổi, đồng bộ vào localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Hàm logout: gọi (tùy chọn) API logout, rồi xóa token + user
  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Lỗi khi gọi /api/admin/logout:", err);
    }
    setUser(null);
    setToken(null);
  };

  return (
    <Router>
      <Grid container spacing={2}>
        {/* ===== TopBar ===== */}
        <Grid item xs={12}>
          <TopBar user={user} logout={logout} />
        </Grid>

        {/* Buffer giữa TopBar và nội dung */}
        <div className="main-topbar-buffer" />

        {/* ===== Cột trái: Sidebar (UserList hoặc thông báo) ===== */}
        <Grid item sm={3}>
          <Paper
            className="main-grid-item"
            sx={{ padding: 2, minHeight: "80vh" }}
          >
            {user ? (
              <UserList token={token} />
            ) : (
              <Typography variant="body1">Please login</Typography>
            )}
          </Paper>
        </Grid>

        {/* ===== Cột phải: Nội dung chính (Routes) ===== */}
        <Grid item sm={9}>
          <Paper
            className="main-grid-item"
            sx={{ padding: 2, minHeight: "80vh" }}
          >
            <Routes>
              {/* 1. Trang login/register */}
              <Route
                path="/login"
                element={
                  <LoginRegister setUser={setUser} setToken={setToken} />
                }
              />

              {/* 2. Thêm route cho AddPhoto */}
              <Route
                path="/addphoto/:userId"
                element={
                  user ? <AddPhoto token={token} /> : <Navigate to="/login" />
                }
              />

              {/* 3. Chi tiết user (chỉ khi đã login) */}
              <Route
                path="/users/:userId"
                element={
                  user ? <UserDetail token={token} /> : <Navigate to="/login" />
                }
              />

              {/* 4. Ảnh của user (chỉ khi đã login) */}
              <Route
                path="/photos/:userId"
                element={
                  user ? (
                    <UserPhotos token={token} currentUser={user} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* 5. /users (không có ID) → redirect về chi tiết của chính mình */}
              <Route
                path="/users"
                element={
                  user ? (
                    <Navigate to={`/users/${user._id}`} replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* 6. Route gốc "/" → redirect tuỳ login */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={user ? `/users/${user._id}` : "/login"}
                    replace
                  />
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to={user ? `/users/${user._id}` : "/login"}
                    replace
                  />
                }
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Router>
  );
};

export default App;
