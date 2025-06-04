import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://d78t48-8081.csb.app";

export default function LoginRegister({ setUser, setToken }) {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");

  const handleTabChange = (e, newValue) => {
    setError(null);
    setLoading(false);
    setTabIndex(newValue);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginName.trim() || !loginPassword.trim()) {
      setError("login_name và password là bắt buộc.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: loginName.trim(),
          password: loginPassword.trim(),
        }),
      });
      if (res.status === 400) {
        const data = await res.json();
        setError(data.error || "login_name hoặc password không đúng.");
      } else if (!res.ok) {
        setError("Server error khi login.");
      } else {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);

        navigate("/");
      }
    } catch {
      setError("Lỗi mạng khi login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (
      !regLoginName.trim() ||
      !regPassword.trim() ||
      !regPasswordConfirm.trim() ||
      !regFirstName.trim() ||
      !regLastName.trim()
    ) {
      setError("login_name, password, first_name, last_name là bắt buộc.");
      return;
    }
    if (regPassword.trim() !== regPasswordConfirm.trim()) {
      setError("Password và Confirm Password phải giống nhau.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: regLoginName.trim(),
          password: regPassword.trim(),
          first_name: regFirstName.trim(),
          last_name: regLastName.trim(),
          location: regLocation.trim(),
          description: regDescription.trim(),
          occupation: regOccupation.trim(),
        }),
      });
      if (res.status === 400) {
        const data = await res.json();
        setError(data.error || "Invalid registration data.");
      } else if (!res.ok) {
        setError("Server error when registering.");
      } else {
        alert("Registration successful! Now please login.");
        setRegLoginName("");
        setRegPassword("");
        setRegPasswordConfirm("");
        setRegFirstName("");
        setRegLastName("");
        setRegLocation("");
        setRegDescription("");
        setRegOccupation("");
        setTabIndex(0);
      }
    } catch {
      setError("Network error when registering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      {tabIndex === 0 && (
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Login Name"
            variant="outlined"
            fullWidth
            required
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Login Name"
            variant="outlined"
            fullWidth
            required
            value={regLoginName}
            onChange={(e) => setRegLoginName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={regPasswordConfirm}
                onChange={(e) => setRegPasswordConfirm(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
              />
            </Grid>
          </Grid>
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={regLocation}
            onChange={(e) => setRegLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Occupation"
            variant="outlined"
            fullWidth
            value={regOccupation}
            onChange={(e) => setRegOccupation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            value={regDescription}
            onChange={(e) => setRegDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register Me"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
