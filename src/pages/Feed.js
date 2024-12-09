import React, { useState, useEffect } from "react";
import { fetchFeed } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  IconButton,
  Pagination,
  Chip,
} from "@mui/material";
import { Favorite, Explore } from "@mui/icons-material";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const postsPerPage = 12;
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetchFeed(token);
        setPosts(response.data);
        setFilteredPosts(response.data);
        setTotalPages(Math.ceil(response.data.length / postsPerPage));
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filtered = category
      ? posts.filter((post) => post.category === category)
      : posts;
    setFilteredPosts(filtered);
    setPage(1);
    setTotalPages(Math.ceil(filtered.length / postsPerPage));
  };

  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  return (
    <Grid mt={12} mx={4}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Typography variant="h6" align="center">
          No posts available
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Explore
                sx={{
                  fontSize: "1.8rem",
                  color: "#404040",
                  border: "solid 1px black",
                  borderRadius: "25px",
                  backgroundColor: "white",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "monospace",
                  color: "#1d2d43",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                Explore Contributions
              </Typography>
            </Box>
            <Chip
              label="#ForYou"
              clickable
              onClick={() => handleCategoryClick(null)}
              sx={{
                fontWeight: "bold",
                backgroundColor: selectedCategory === null ? "black" : "white",
                color: selectedCategory === null ? "white" : "black",
                border: "2px solid black",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === null ? "black" : "#f0f0f0",
                },
              }}
            />
            <Chip
              label="#Social Welfare"
              clickable
              onClick={() => handleCategoryClick("Social Welfare")}
              sx={{
                fontWeight: "bold",
                backgroundColor:
                  selectedCategory === "Social Welfare" ? "black" : "white",
                color:
                  selectedCategory === "Social Welfare" ? "white" : "black",
                border: "2px solid #ff89ad",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "Social Welfare" ? "black" : "#f0f0f0",
                },
              }}
            />
            <Chip
              label="#Animal Welfare"
              clickable
              onClick={() => handleCategoryClick("Animal Welfare")}
              sx={{
                fontWeight: "bold",
                backgroundColor:
                  selectedCategory === "Animal Welfare" ? "black" : "white",
                color:
                  selectedCategory === "Animal Welfare" ? "white" : "black",
                border: "2px solid #ffc800",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "Animal Welfare" ? "black" : "#f0f0f0",
                },
              }}
            />
            <Chip
              label="#Environmental"
              clickable
              onClick={() => handleCategoryClick("Environmental")}
              sx={{
                fontWeight: "bold",
                backgroundColor:
                  selectedCategory === "Environmental" ? "black" : "white",
                color: selectedCategory === "Environmental" ? "white" : "black",
                border: "2px solid #25ff00",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "Environmental" ? "black" : "#f0f0f0",
                },
              }}
            />
            <Chip
              label="#Innovation"
              clickable
              onClick={() => handleCategoryClick("Innovation")}
              sx={{
                fontWeight: "bold",
                backgroundColor:
                  selectedCategory === "Innovation" ? "black" : "white",
                color: selectedCategory === "Innovation" ? "white" : "black",
                border: "2px solid #4edeff",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === "Innovation" ? "black" : "#f0f0f0",
                },
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {currentPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card
                  onClick={() => handlePostClick(post.id)}
                  sx={{
                    cursor: "pointer",
                    border: "2px solid #333333",
                    borderRadius: "12px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  {post.media && post.media.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${backendUrl}${post.media[0].url}`} // Using backendUrl for media URL
                      alt={post.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {post.title}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center">
                        <IconButton
                          sx={{ color: "red" }}
                          size="small"
                          disableRipple
                        >
                          <Favorite />
                        </IconButton>
                        <Typography variant="body2">
                          {(post.likes || []).length}
                        </Typography>

                        <IconButton
                          sx={{ color: "#a1a1a1", ml: 1 }}
                          size="small"
                          disableRipple
                        >
                          <ModeCommentIcon />
                        </IconButton>
                        <Typography variant="body2">
                          {(post.comments || []).length}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center" my={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                ".MuiPaginationItem-root.Mui-selected": {
                  color: "#fff",
                  backgroundColor: "black",
                },
              }}
            />
          </Box>
        </>
      )}
    </Grid>
  );
};

export default Feed;
