import React, { useState, useEffect } from "react";
import { addComment, fetchComments, deleteComment } from "../services/api";
import {
  TextField,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

const Comment = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchCommentList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetchComments(postId, token);
        setCommentList(response);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments. Please try again later.");
      }
    };

    fetchCommentList();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return; // Prevent empty comments
    try {
      const token = localStorage.getItem("token");
      const response = await addComment(postId, newComment, token);
      setCommentList([...commentList, response]);
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
      await deleteComment(postId, commentId, token);
      setCommentList(commentList.filter((comment) => comment.id !== commentId));
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

  // Handle Enter key press to submit the comment
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  // Display only 5 comments initially, unless "Show All" is clicked
  const displayedComments = showAllComments
    ? commentList
    : commentList.slice(0, 5);

  return (
    <Box>
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

      {commentList.length > 5 && (
        <Button onClick={() => setShowAllComments(!showAllComments)}>
          {showAllComments ? "Show Less" : "Show More"}
        </Button>
      )}

      {/* Comment input field and submit icon */}
      <Box display="flex" alignItems="center" mt={2}>
        <TextField
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress} // Handle Enter key press
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
  );
};

export default Comment;
