import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import models from "../../modelData/models"

/**
 * Define TopBar, a React component of Project 4.
 */

function TopBar () {
  const location = useLocation();
  const params = useParams();
  const [viewTitle, setViewTitle] = useState("");

  useEffect(() => {
    const { pathname } = location;

    if (pathname.startsWith("/users/") && params.userId) {
      const user = models.userModel(params.userId);
      setViewTitle(user ? `${user.first_name} ${user.last_name}` : "User Not Found");
    } else if (pathname.startsWith("/photos/") && params.userId) {
      const user = models.userModel(params.userId);
      setViewTitle(user ? `Photos of ${user.first_name}` : "User Not Found");
    } else {
      setViewTitle("Photo Sharing Application");
    }
  }, [location, params.userId]);
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit">
          {viewTitle}
        </Typography>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
