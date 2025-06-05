import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8081";

function UserList({ token }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          console.error("Unable to load users:", res.status);
          return;
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error calling /api/user/list:", err);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div>
      <Typography variant="body1">
        This is the user list, which takes up 3/12 of the window. You might
        choose to use <a href="https://mui.com/components/lists/">Lists</a> and{" "}
        <a href="https://mui.com/components/dividers/">Dividers</a> to display
        your users like so:
      </Typography>
      <List component="nav">
        {users.length > 0 ? (
          users.map((item) => (
            <React.Fragment key={item._id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Link
                      to={`/users/${item._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.first_name} {item.last_name}
                    </Link>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1">No users found.</Typography>
        )}
      </List>
    </div>
  );
}

export default UserList;
