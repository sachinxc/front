import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPostById,
  likePost,
  fetchComments,
  addComment,
  deleteComment,
} from "../services/api";
import {
  Container,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Divider,
  IconButton,
  Button,
  TextField,
  Menu,
  MenuItem,
  CardMedia,
} from "@mui/material";
import {
  Favorite,
  LocationOn,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { format, isValid } from "date-fns";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const postResponse = await fetchPostById(id, token);
        setPost(postResponse);
        setLikes(postResponse.likes || []);
        setUserHasLiked(postResponse.userHasLiked);
        const commentsResponse = await fetchComments(id, token);
        setComments(commentsResponse);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await likePost(id, token);
      if (response && response.likes) {
        setLikes(response.likes);
        setUserHasLiked(!userHasLiked);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const token = localStorage.getItem("token");
      const response = await addComment(id, newComment, token);
      setComments([...comments, response]);
      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteComment(id, commentId, token);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleDeleteClick = () => {
    if (selectedCommentId) {
      handleDeleteComment(selectedCommentId);
      handleMenuClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const toggleActivityLog = () => {
    setShowActivityLog(!showActivityLog);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!post) {
    return (
      <Typography variant="h6" align="center">
        Post not found
      </Typography>
    );
  }

  const {
    user = {},
    media = [],
    title,
    description,
    category,
    location,
    dateTime,
    activityLog,
  } = post;
  const { firstName, lastName, organizationName, username, profilePic } = user;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const displayedComments = showAllComments ? comments : comments.slice(0, 5);

  return (
    <Container>
      <Card
        sx={{
          width: "100%",
          margin: "100px auto 24px auto",
          boxShadow: 3,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            my={2}
            textAlign={"center"}
          >
            {title}
          </Typography>

          <Slider {...settings}>
            {media.map((mediaItem, index) => (
              <div key={index}>
                {mediaItem.url.endsWith(".mp4") ? (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "contain",
                      margin: "0 auto",
                      display: "block",
                    }}
                  >
                    <source
                      src={`${backendUrl}${mediaItem.url}`}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <CardMedia
                    component="img"
                    src={`${backendUrl}${mediaItem.url}`}
                    alt={`Media ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "contain",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                )}
              </div>
            ))}
          </Slider>

          <Box display="flex" alignItems="center" my={4}>
            <Avatar
              src={profilePic ? `${backendUrl}${profilePic}` : null}
              alt={username}
              sx={{ width: 50, height: 50, marginRight: 2 }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {firstName} {lastName} {organizationName} (@{username})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {dateTime && isValid(new Date(dateTime))
                  ? format(new Date(dateTime), "PPP")
                  : "Unknown Date"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {category}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <LocationOn sx={{ fontSize: 18, color: "gray", mr: 0.5 }} />
                <Typography variant="body2" color="textSecondary">
                  {location}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" mt={2} mb={2}>
            {description}
          </Typography>

          <Button onClick={toggleActivityLog} variant="outlined" sx={{ mb: 2 }}>
            {showActivityLog ? "Hide Activity Log" : "Show Activity Log"}
          </Button>

          {showActivityLog && (
            <Box mt={2}>
              <Typography variant="body1" mt={2} mb={1}>
                Activity Log:
              </Typography>

              <pre
                style={{
                  backgroundColor: "#f4f4f4",
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {activityLog
                  ? JSON.stringify(JSON.parse(activityLog), null, 2) // format the JSON
                  : "No activity log has been found for this contribution"}
              </pre>
            </Box>
          )}

          <Divider sx={{ marginBottom: 2 }} />

          <Box display="flex" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" mr={2}>
              <IconButton
                onClick={handleLikeClick}
                sx={{
                  color: userHasLiked ? "red" : "gray",
                  "&:hover": { color: "red" },
                }}
              >
                <Favorite />
              </IconButton>
              <Typography variant="body2">{likes.length}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton sx={{ color: "gray" }}>
                <ModeCommentIcon />
              </IconButton>
              <Typography variant="body2">{comments.length}</Typography>
            </Box>
          </Box>

          <Divider sx={{ marginBottom: 2 }} />

          <Box mt={2}>
            {displayedComments.map((comment, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Typography variant="body2">
                  <strong>
                    {comment.user ? comment.user.username : "Unknown User"}
                  </strong>
                  : {comment.content}
                </Typography>
                {comment.user && comment.userId === userId && (
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, comment.id)}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            ))}

            {comments.length > 5 && (
              <Button onClick={() => setShowAllComments(!showAllComments)}>
                {showAllComments ? "Show Less" : "Show More"}
              </Button>
            )}

            <Box display="flex" alignItems="center" mt={2}>
              <TextField
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                variant="outlined"
                size="small"
              />
              <IconButton onClick={handleAddComment} sx={{ marginLeft: 1 }}>
                <ModeCommentIcon />
              </IconButton>
            </Box>

            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostPage;
