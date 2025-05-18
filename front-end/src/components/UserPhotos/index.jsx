import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Link as MuiLink,
  CircularProgress,
  Box,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchModel(`/photosOfUser/${userId}`).then((data) => {
      if (data) {
        setPhotos(data);
        setError(null);
      } else {
        setError("Không tìm thấy ảnh cho người dùng này.");
      }
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Photos of User ID: {userId}
      </Typography>

      {photos.length > 0 ? (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              image={require(`../../images/${photo.file_name}`)} // Thư mục images trong /public hoặc cấu hình phù hợp
              alt={`Photo by User ID: ${userId}`}
              sx={{ width: 300, height: "auto", mx: "auto", mt: 2 }}
            />

            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {new Date(photo.date_time).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>

              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((c) => (
                  <div key={c._id} style={{ marginBottom: 16 }}>
                    <MuiLink
                      component={Link}
                      to={`/users/${c.user._id}`}
                      underline="hover"
                      variant="subtitle2"
                    >
                      {c.user.first_name} {c.user.last_name}
                    </MuiLink>

                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(c.date_time).toLocaleString()}
                    </Typography>

                    <Typography variant="body2">{c.comment}</Typography>

                    <Divider sx={{ mt: 2 }} />
                  </div>
                ))
              ) : (
                <Typography variant="body2">No comments.</Typography>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2">No photos found for this user.</Typography>
      )}
    </div>
  );
}

export default UserPhotos;
