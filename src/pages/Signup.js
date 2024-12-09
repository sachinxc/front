import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
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
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import PersonIcon from "@mui/icons-material/Person";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signup } from "../services/api";
import sideImage from "../assets/signupside.jpg";
import { Link as RouterLink } from "react-router-dom";
import countries from "../components/Countries"; // Imports the countries array

const defaultTheme = createTheme();

const SignupSchema = Yup.object().shape({
  accountType: Yup.string().required("Please select an account type"),
  firstName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .when("accountType", {
      is: "individual",
      then: (schema) => schema.required("First Name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  lastName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .when("accountType", {
      is: "individual",
      then: (schema) => schema.required("Last Name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  organizationName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Organization Name must be at most 50 characters")
    .when("accountType", {
      is: "organization",
      then: (schema) => schema.required("Organization Name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  username: Yup.string()
    .matches(
      /^[a-zA-Z0-9._]{1,30}$/,
      "Username can only contain letters, numbers, periods, and underscores up to 30."
    )
    .matches(
      /^(?!.*[_.]{2})(?![_.]).*[^_.]$/,
      "Username cannot start or end with periods or underscores, and no consecutive ones."
    )
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  dob: Yup.date().when("accountType", {
    is: "individual",
    then: (schema) => schema.required("Date of Birth is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  gender: Yup.string().when("accountType", {
    is: "individual",
    then: (schema) => schema.required("Gender is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  country: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]\d{6,14}$/, "Invalid phone number format.")
    .required("Required"),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#ada6f1";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (values, { setSubmitting }) => {
    const filteredValues =
      values.accountType === "organization"
        ? {
            ...values,
            firstName: undefined,
            lastName: undefined,
            dob: undefined,
            gender: undefined,
          }
        : { ...values, organizationName: undefined };

    try {
      const response = await signup(filteredValues);
      console.log("User signed up:", response.data);
    } catch (error) {
      console.error("Error signing up:", error);
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
        }}
      >
        <Box
          sx={{
            width: "70%",
            borderRadius: "20px",
            overflow: "hidden",
            "@media (max-width: 1500px)": { width: "90%" },
          }}
        >
          <Grid container component="main">
            <CssBaseline />
            {/* Side Photo */}
            <Grid
              item
              xs={false}
              sm={4}
              md={4}
              sx={{
                backgroundImage: `url(${sideImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Signup Form */}
            <Grid
              item
              xs={12}
              sm={8}
              md={8}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 2,

                  mx: 4,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Formik
                  initialValues={{
                    accountType: "",
                    firstName: "",
                    lastName: "",
                    organizationName: "",
                    username: "",
                    email: "",
                    dob: "",
                    gender: "",
                    country: "",
                    password: "",
                    confirmPassword: "",
                    phoneNumber: "",
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    isSubmitting,
                    touched,
                    errors,
                    setFieldValue,
                  }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} mt={1}>
                          <Box
                            display="flex"
                            //flexDirection="column"
                            justifyContent="left"
                          >
                            <Typography
                              component="h1"
                              variant="h5"
                              fontWeight={600}
                              sx={{ fontSize: "1.4rem" }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Avatar
                                  sx={{
                                    mr: 1,
                                    bgcolor: "rgb(211 0 176)",
                                    width: "35px",
                                    height: "35px",
                                  }}
                                >
                                  <PersonIcon />
                                </Avatar>
                                Sign Up
                              </Box>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          mt={2}
                          sx={{ textAlign: "center" }}
                        >
                          <Link
                            component={RouterLink}
                            to="/login"
                            variant="body1"
                            underline="none"
                            sx={{
                              fontSize: "1.05rem",
                              color: "#646464",
                              "&:hover span": {
                                color: "#0079ff",
                              },
                              "& span": {
                                color: "#0ea4da",
                                fontWeight: "bold",
                                transition: "color 0.3s",
                              },
                            }}
                          >
                            Already have an account? <span>Log in</span>
                          </Link>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            {/* Add a label explicitly */}
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "bold",
                                marginBottom: "8px",
                                color: "#646464",
                              }}
                            >
                              Select an Account Type
                            </Typography>

                            <ToggleButtonGroup
                              value={values.accountType}
                              exclusive
                              onChange={(event, value) => {
                                if (value !== null) {
                                  setFieldValue("accountType", value);
                                }
                              }}
                              aria-label="account type"
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                flexWrap: "wrap",

                                ".MuiToggleButton-root": {
                                  flex: "1 1 45%",
                                  minWidth: 0,

                                  textAlign: "center", // text alignment
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                  transition: "all 0.3s ease",
                                },
                                ".MuiToggleButton-root.Mui-selected": {
                                  backgroundColor: "#62f4b8",
                                  fontWeight: "bold",
                                  color: "#4b5f5a",
                                  transition: "all 0.3s ease",
                                },

                                ".MuiToggleButton-root.Mui-selected:hover": {
                                  backgroundColor: "#62f4b8",
                                  transition: "all 0.3s ease",
                                },

                                ".MuiToggleButton-root:hover": {
                                  backgroundColor: "#defef2",
                                  transition: "all 0.3s ease",
                                },
                              }}
                            >
                              <ToggleButton
                                value="individual"
                                aria-label="individual"
                              >
                                Individual
                              </ToggleButton>
                              <ToggleButton
                                value="organization"
                                aria-label="organization"
                              >
                                Organization
                              </ToggleButton>
                            </ToggleButtonGroup>

                            {touched.accountType && errors.accountType && (
                              <FormHelperText error>
                                {errors.accountType}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        {(values.accountType === "individual" ||
                          values.accountType === "") && (
                          <>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              mt={3}
                              sx={{ paddingTop: "5px !important" }}
                            >
                              <FormControl fullWidth margin="normal">
                                <Field
                                  name="firstName"
                                  as={TextField}
                                  label="First Name"
                                  required
                                  error={
                                    touched.firstName &&
                                    Boolean(errors.firstName)
                                  }
                                />
                                <ErrorMessage
                                  name="firstName"
                                  component={FormHelperText}
                                  sx={{ color: "red" }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              sx={{ paddingTop: "5px !important" }}
                            >
                              <FormControl fullWidth margin="normal">
                                <Field
                                  name="lastName"
                                  as={TextField}
                                  label="Last Name"
                                  required
                                  error={
                                    touched.lastName && Boolean(errors.lastName)
                                  }
                                />
                                <ErrorMessage
                                  name="lastName"
                                  component={FormHelperText}
                                  sx={{ color: "red" }}
                                />
                              </FormControl>
                            </Grid>
                          </>
                        )}

                        {values.accountType === "organization" && (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            mt={3}
                            sx={{ paddingTop: "5px !important" }}
                          >
                            <FormControl fullWidth margin="normal">
                              <Field
                                name="organizationName"
                                as={TextField}
                                label="Organization Name"
                                error={
                                  touched.organizationName &&
                                  Boolean(errors.organizationName)
                                }
                              />
                              <ErrorMessage
                                name="organizationName"
                                component={FormHelperText}
                                sx={{ color: "red" }}
                              />
                            </FormControl>
                          </Grid>
                        )}

                        {/* Row 1: username, email, dob, gender, country */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            <Field
                              name="username"
                              as={TextField}
                              label="Username"
                              required
                              error={
                                touched.username && Boolean(errors.username)
                              }
                            />
                            <ErrorMessage
                              name="username"
                              component={FormHelperText}
                              sx={{ color: "red" }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            <Field
                              name="email"
                              as={TextField}
                              type="email"
                              label="Email"
                              required
                              error={touched.email && Boolean(errors.email)}
                            />
                            <ErrorMessage
                              name="email"
                              component={FormHelperText}
                              sx={{ color: "red" }}
                            />
                          </FormControl>
                        </Grid>
                        {(values.accountType === "individual" ||
                          values.accountType === "") && (
                          <>
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              sx={{ paddingTop: "5px !important" }}
                            >
                              <FormControl fullWidth margin="normal">
                                <Field
                                  name="dob"
                                  as={TextField}
                                  type="date"
                                  label="Date of Birth"
                                  InputLabelProps={{ shrink: true }}
                                  required
                                  error={touched.dob && Boolean(errors.dob)}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={3}
                              sx={{ paddingTop: "5px !important" }}
                            >
                              <FormControl fullWidth margin="normal">
                                <InputLabel>Gender</InputLabel>
                                <Field
                                  name="gender"
                                  as={Select}
                                  label="Gender"
                                  required
                                  error={
                                    touched.gender && Boolean(errors.gender)
                                  }
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="male">Male</MenuItem>
                                  <MenuItem value="female">Female</MenuItem>
                                  <MenuItem value="other">Other</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                          </>
                        )}
                        <Grid
                          item
                          xs={12}
                          sm={values.accountType === "organization" ? 6 : 4.5}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Country</InputLabel>
                            <Field
                              name="country"
                              as={Select}
                              label="Country"
                              error={touched.country && Boolean(errors.country)}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {countries.map((country) => (
                                <MenuItem key={country} value={country}>
                                  {country}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </Grid>

                        {/* Row 2: phone number, password, confirm password */}
                        <Grid
                          item
                          xs={12}
                          sm={values.accountType === "organization" ? 6 : 4.5}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            <Field
                              name="phoneNumber"
                              as={TextField}
                              label="Phone Number"
                              required
                              error={
                                touched.phoneNumber &&
                                Boolean(errors.phoneNumber)
                              }
                            />
                            <ErrorMessage
                              name="phoneNumber"
                              component={FormHelperText}
                              sx={{ color: "red" }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            <Field
                              name="password"
                              as={TextField}
                              type={showPassword ? "text" : "password"}
                              label="Password"
                              required
                              error={
                                touched.password && Boolean(errors.password)
                              }
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
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControl fullWidth margin="normal">
                            <Field
                              name="confirmPassword"
                              as={TextField}
                              type="password"
                              label="Confirm Password"
                              required
                              error={
                                touched.confirmPassword &&
                                Boolean(errors.confirmPassword)
                              }
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component={FormHelperText}
                              sx={{ color: "red" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Field
                                name="agreeToTerms"
                                as={Checkbox}
                                color="primary"
                              />
                            }
                            label="I agree to the terms and conditions"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          sx={{ paddingTop: "5px !important" }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                              mt: 2,
                              mb: 1,
                              p: 1,
                              fontWeight: "bold",
                              boxShadow: "none",
                              borderRadius: "10px",
                              backgroundColor: "#d300b0",
                              "&:hover": { backgroundColor: "#9c007a" },
                            }}
                            disabled={isSubmitting}
                          >
                            Sign Up
                          </Button>
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
