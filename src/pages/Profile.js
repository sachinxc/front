import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  fetchProfile,
  updateBio,
  updateProfilePic,
  deletePost,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Avatar,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardMedia,
  CardContent,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import MenuComponent from "../components/faceRecognition/Menu";
import Register from "../components/faceRecognition/Register";
import Success from "../components/faceRecognition/Success";
import Test from "../components/faceRecognition/Test";
import TestPhoto from "../components/faceRecognition/TestPhoto";
import ManageFaces from "../components/faceRecognition/ManageFaces";
import Wallet from "../components/blockchain/Wallet";

const Profile = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [, setNewBio] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");
  const [error, setError] = useState("");
  const [biometricsMode, setBiometricsMode] = useState(false);
  const [walletMode, setWalletMode] = useState(false); // Wallet mode state
  const [biometricsScreen, setBiometricsScreen] = useState("menu");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProfile(id, token);
        setProfile(response.data);
        setNewBio(response.data.bio);
        setNewProfilePic(response.data.profilePic);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchData();
  }, [id, token]);

  const ProfileSchema = Yup.object().shape({
    bio: Yup.string().max(150, "Bio must be at most 150 characters"),
  });

  const handleUpdateBio = async (values) => {
    try {
      await updateBio(values.bio, token);
      setProfile({ ...profile, bio: values.bio });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating bio:", err);
      setError("Failed to update bio. Please try again later.");
    }
  };

  const handleUpdateProfilePic = async () => {
    try {
      await updateProfilePic(newProfilePic, token);
      setProfile({ ...profile, profilePic: newProfilePic });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile picture:", err);
      setError("Failed to update profile picture. Please try again later.");
    }
  };

  const handleMenuClick = (event, postId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPost(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleDeleteClick = () => {
    setPostToDelete(selectedPost);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteContribution = async () => {
    try {
      await deletePost(postToDelete, token);
      setProfile({
        ...profile,
        posts: profile.posts.filter((post) => post.id !== postToDelete),
      });
      setDialogOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error("Error deleting contribution:", err);
      setError("Failed to delete post. Please try again later.");
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Navigate to the original post page
  };

  if (!profile) {
    return <CircularProgress />;
  }

  const isOwnProfile = user && user.id === parseInt(id);

  // If in biometrics mode shows the facerecognition app
  if (biometricsMode) {
    return (
      <div className="App">
        <MenuComponent
          onTest={() => setBiometricsScreen("test")}
          onTestPhoto={() => setBiometricsScreen("testPhoto")}
          onManageFaces={() => setBiometricsScreen("manageFaces")}
          onRegister={() => setBiometricsScreen("register")}
        />

        {biometricsScreen === "register" && (
          <Register onSuccess={() => setBiometricsScreen("success")} />
        )}
        {biometricsScreen === "success" && (
          <Success onNext={() => setBiometricsScreen("menu")} />
        )}
        {biometricsScreen === "test" && <Test />}
        {biometricsScreen === "testPhoto" && <TestPhoto />}
        {biometricsScreen === "manageFaces" && <ManageFaces />}
      </div>
    );
  }

  // shows the wallet component
  if (walletMode) {
    return <Wallet />;
  }

  return (
    <Container
      className="profile-container"
      sx={{
        backgroundColor: "white",
        my: 12,
        width: "95%",
        border: "solid 3px #404040",
      }}
    >
      <Grid
        container
        className="profile-header"
        sx={{
          p: 2,
          color: "black",
          backgroundColor: "#edf6ff",
          borderRadius: 3,
        }}
      >
        <Grid
          item
          xs={12}
          py={1}
          md={5}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            alt="Profile"
            src={`${backendUrl}${profile.profilePic}`}
            sx={{ width: 100, height: 100 }}
          />
          <Box mr={1}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {profile.firstName} {profile.lastName} {profile.organizationName}
            </Typography>
            <Typography variant="subtitle1">@{profile.username}</Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {profile.bio}
            </Typography>

            {isOwnProfile && (
              <Button
                color="primary"
                onClick={() => setIsEditing(!isEditing)}
                sx={{
                  px: 1.5,
                  color: "black",
                  backgroundColor: "white",
                  border: "solid 1px black",
                  borderRadius: "20px",
                  textTransform: "none",
                  marginTop: "8px",
                }}
              >
                <EditIcon sx={{ fontSize: "1.2rem", marginRight: "4px" }} />
                Edit
              </Button>
            )}
          </Box>
        </Grid>

        {/* Indicator Section */}

        <Grid
          container
          xs={12}
          md={3}
          sx={{
            background: "linear-gradient(0deg, #edf6ff, #e6e4ff)",
            borderRadius: 3,
            py: 2,
            px: 2,
            fontFamily: "'Press Start 2P', cursive",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          {/* Followers */}
          <Grid item sx={{ textAlign: "center", flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                color: "black",
                fontWeight: "bold",
                marginBottom: "4px",
                mr: 1,
              }}
            >
              {profile.followers.length}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "monospace",
                fontSize: "1rem",
                color: "black",
                fontWeight: "bold",
                mr: 1,
              }}
            >
              Followers
            </Typography>
          </Grid>

          {/* Contributions */}
          <Grid item sx={{ textAlign: "center", flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                color: "black",
                fontWeight: "bold",
                marginBottom: "4px",
                ml: 1,
              }}
            >
              {profile.totalPosts || "0"}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "monospace",
                fontSize: "1rem",
                color: "black",
                fontWeight: "bold",
                ml: 1,
              }}
            >
              Contributions
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          p={1}
          md={4}
          className="profile-info"
          sx={{ textAlign: "center" }}
        >
          <Box
            sx={{
              display: "inline-block",
              textAlign: "center",
              margin: "0 10px",
            }}
          >
            <IconButton
              color="secondary"
              onClick={() => setBiometricsMode(true)}
              sx={{
                flexDirection: "column",
              }}
            >
              <AssessmentIcon sx={{ color: "#00a3ff", fontSize: "3.5rem" }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  color: "black",
                  marginTop: "4px",
                  fontWeight: "bold",
                }}
              >
                Analytics
              </Typography>
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "inline-block",
              textAlign: "center",
              margin: "0 10px",
            }}
          >
            <IconButton
              color="secondary"
              onClick={() => setWalletMode(true)}
              sx={{
                flexDirection: "column",
              }}
            >
              <AccountBalanceWalletIcon
                sx={{ color: "#fc007e", fontSize: "3.5rem" }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  color: "black",
                  marginTop: "4px",
                  fontWeight: "bold",
                }}
              >
                Wallet
              </Typography>
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "inline-block",
              textAlign: "center",
              margin: "0 10px",
            }}
          >
            <IconButton
              color="secondary"
              onClick={() => setBiometricsMode(true)}
              sx={{
                flexDirection: "column",
              }}
            >
              <FingerprintIcon sx={{ color: "#1aaf00", fontSize: "3.5rem" }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "monospace",
                  color: "black",
                  marginTop: "4px",
                  fontWeight: "bold",
                }}
              >
                Biometrics
              </Typography>
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Section Profile Info */}
      {isEditing && isOwnProfile && (
        <Paper
          className="edit-section"
          elevation={3}
          style={{ marginTop: "20px" }}
        >
          <Formik
            initialValues={{ bio: profile.bio || "" }}
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateBio}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <TextField
                  name="bio"
                  label="Update Bio"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={values.bio}
                  onChange={handleChange}
                  margin="normal"
                  error={Boolean(errors.bio && touched.bio)}
                  helperText={errors.bio && touched.bio && errors.bio}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: "10px" }}
                >
                  Update Bio
                </Button>
              </Form>
            )}
          </Formik>
          <TextField
            label="Update Profile Picture URL"
            variant="outlined"
            fullWidth
            value={newProfilePic}
            onChange={(e) => setNewProfilePic(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfilePic}
          >
            Update Profile Picture
          </Button>
        </Paper>
      )}

      {error && <Typography color="error">{error}</Typography>}
      <Box
        className="contributions"
        sx={{
          my: 1,
          p: 2,
          backgroundColor: "#f7f7f7",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "#424242", fontWeight: "bold" }}>
          My contributions
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {profile.posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
                onClick={() => handlePostClick(post.id)}
              >
                {post.media && post.media.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${backendUrl}${post.media[0].url}`}
                    alt={post.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {post.title}
                  </Typography>
                </CardContent>

                {isOwnProfile && (
                  <IconButton
                    onClick={(e) => handleMenuClick(e, post.id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      color: "white",

                      backgroundColor: "dimgray",
                      "&:hover": {
                        backgroundColor: "black",
                      },
                    }}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteContribution} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
