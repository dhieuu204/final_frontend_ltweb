import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8081";

function UserDetail({ token }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (res.status === 404) {
          setError("User not found");
          setUser(null);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError("Failed to fetch user details");
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user detail:", err);
        setError("Network error while fetching user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserDetail();
    } else {
      navigate("/login");
    }
  }, [userId, token, navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <b>Location:</b> {user.location}
      </Typography>
      <Typography variant="body1">
        <b>Occupation:</b> {user.occupation}
      </Typography>
      <Typography variant="body1">
        <b>Description:</b> {user.description}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        <Link to={`/photos/${userId}`}>View Photos of {user.first_name}</Link>
      </Typography>
    </>
  );
}

export default UserDetail;
