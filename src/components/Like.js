import React, { useState, useEffect } from "react";
import { likePost } from "../services/api";
import { Button, Typography } from "@mui/material";

const Like = ({ postId, initialLikes = [], userHasLiked }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(userHasLiked);

  useEffect(() => {
    setHasLiked(userHasLiked); // Sync with the initial like status from props
  }, [userHasLiked]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await likePost(postId, token);
      if (response && response.likes) {
        setLikes(response.likes);
        setHasLiked(
          response.likes.includes(parseInt(localStorage.getItem("userId")))
        );
      } else {
        console.error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleLike}>
        {hasLiked ? "Unlike" : "Like"}
      </Button>
      <Typography>{likes.length} Likes</Typography>
    </div>
  );
};

export default Like;
