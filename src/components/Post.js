import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Comment from "./Comment";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { Favorite, LocationOn } from "@mui/icons-material";
import { likePost, fetchComments } from "../services/api";
import { format, isValid } from "date-fns";

const Post = ({ post, userHasLiked: initialUserHasLiked, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);
  const [comments, setComments] = useState(post.comments || []);

  useEffect(() => {
    const fetchCommentList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetchComments(post.id, token);
        setComments(response);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentList();
  }, [post.id]);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await likePost(post.id, token);

      if (response && response.likes) {
        setLikes(response.likes);
        setUserHasLiked(!userHasLiked);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  if (!post) return null;

  const {
    user = {},
    media = [],
    title,
    description,
    category,
    location,
    dateTime,
  } = post;
  const { firstName, lastName, username, profilePic } = user;

  // Slider settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  // Get the backend URL from the environment variable
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  return (
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
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign={"center"}>
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

        <Box display="flex" alignItems="center" mt={2} mb={2}>
          <Avatar
            src={profilePic ? `${backendUrl}${profilePic}` : null}
            alt={username}
            sx={{ width: 50, height: 50, marginRight: 2 }}
          />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {firstName} {lastName} (@{username})
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
          <Comment postId={post.id} />
        </Box>

        {onDelete && (
          <Button
            onClick={() => onDelete(post.id)}
            variant="outlined"
            color="secondary"
            sx={{ marginTop: 2 }}
          >
            Delete Post
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Post;
