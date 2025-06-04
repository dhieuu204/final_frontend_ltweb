import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useParams, useNavigate } from "react-router-dom";

function TopBar({ user, logout, userMap }) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [viewTitle, setViewTitle] = useState("");

  useEffect(() => {
    const { pathname } = location;

    if (pathname.startsWith("/users/") && params.userId) {
      const userObj = userMap[params.userId];
      setViewTitle(
        userObj
          ? `${userObj.first_name} ${userObj.last_name}`
          : "User Not Found"
      );
    } else if (pathname.startsWith("/photos/") && params.userId) {
      const userObj = userMap[params.userId];
      setViewTitle(
        userObj ? `Photos of ${userObj.first_name}` : "User Not Found"
      );
    } else {
      setViewTitle("Photo Sharing Application");
    }
  }, [location, params.userId, userMap]);

  const handleAddPhotoClick = () => {
    if (user && user._id) {
      navigate(`/addphoto/${user._id}`);
    }
  };

  return (
    <AppBar position="static" className="topbar-appBar">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" color="inherit">
            {viewTitle}
          </Typography>
          {user && (
            <Button
              color="inherit"
              onClick={handleAddPhotoClick}
              sx={{ ml: 2 }}
            >
              Add Photo
            </Button>
          )}
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography style={{ marginRight: "1rem" }}>
              Hi {user.first_name}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Typography>Please Login</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
