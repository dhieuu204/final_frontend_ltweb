import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = "https://d78t48-8081.csb.app";

export default function AddPhoto({ token }) {
  const { userId } = useParams(); // ID người dùng hiện tại
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setError(null);
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Bạn phải chọn một file ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/photosOfUser/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Chú ý: không đặt "Content-Type" khi dùng FormData
        },
        body: formData,
      });

      if (res.status === 400) {
        const data = await res.json();
        setError(data.error || "Yêu cầu không hợp lệ.");
      } else if (!res.ok) {
        setError("Lỗi server, vui lòng thử lại.");
      } else {
        // Upload thành công → chuyển về trang ảnh của user
        navigate(`/photos/${userId}`);
      }
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
      setError("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Thêm ảnh cho User ID: {userId}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "1rem" }}
        />

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Upload Ảnh"}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Hủy
          </Button>
        </Box>
      </form>
    </Box>
  );
}
