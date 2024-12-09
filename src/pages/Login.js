import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  FormControl,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { login } from "../services/api";
import sideImage from "../assets/loginside.svg";
import { Link as RouterLink } from "react-router-dom";

const defaultTheme = createTheme();

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function SignInSide() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    document.body.style.backgroundColor = "#ada6f1";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError("");
      const response = await login(values);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      window.location.href = "/feed";
    } catch (error) {
      setLoginError("Invalid email or password. Please try again.");
      console.error("Error logging in:", error);
    }
    setSubmitting(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
          marginBottom: "100px",
          minHeight: "600px",
        }}
      >
        <Box
          sx={{
            width: "70%",
            borderRadius: "20px",
            overflow: "hidden",
            "@media (max-width: 1200px)": { width: "90%" },
          }}
        >
          <Grid container component="main">
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: `url(${sideImage})`,
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "600px",
              }}
            >
              <Box
                sx={{
                  mx: 4,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "rgb(211 0 176)" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" fontWeight={600}>
                  Sign In
                </Typography>
                {loginError && (
                  <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                    {loginError}
                  </Alert>
                )}
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={LoginSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form style={{ width: "100%" }}>
                      <FormControl fullWidth margin="normal">
                        <Field
                          as={TextField}
                          name="email"
                          label="Email Address"
                          margin="normal"
                          required
                          fullWidth
                          autoComplete="email"
                          autoFocus
                          variant="standard"
                        />
                        <Box sx={{ minHeight: "24px" }}>
                          <ErrorMessage name="email" component="div" />
                        </Box>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <Field
                          as={TextField}
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          margin="normal"
                          required
                          fullWidth
                          autoComplete="current-password"
                          variant="standard"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Box sx={{ minHeight: "24px" }}>
                          <ErrorMessage name="password" component="div" />
                        </Box>
                      </FormControl>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 3,
                          backgroundColor: "#2ab6bb",
                          boxShadow: "none",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#087478",
                          },
                        }}
                        disabled={isSubmitting}
                      >
                        Sign In
                      </Button>

                      <Grid container sx={{ color: "#646464" }}>
                        <Grid item xs>
                          <Link
                            href="#"
                            variant="body2"
                            color="inherit"
                            underline="none"
                          >
                            Forgot password?
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link
                            component={RouterLink}
                            to="/signup"
                            variant="body2"
                            underline="none"
                            sx={{
                              color: "#646464",
                              "&:hover span": {
                                color: "#d700c7",
                              },
                              "& span": {
                                color: "#d94dd8",
                                fontWeight: "bold",
                                transition: "color 0.3s",
                              },
                            }}
                          >
                            Don't have an account? <span>Sign Up</span>
                          </Link>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
