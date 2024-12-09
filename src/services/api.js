import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_API_URL; //This is the backend API URL

// Helper function to retrieve authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Signup
export const signup = (userData) =>
  axios.post(`${API_URL}/auth/signup`, userData);

// Login
export const login = (userData) =>
  axios.post(`${API_URL}/auth/login`, userData);

// Create Post with Header Logging
export const createPost = (postData) => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "multipart/form-data",
  };

  // Log the headers before sending the request
  console.log("Headers being sent in createPost:", headers);

  return axios.post(`${API_URL}/posts/create`, postData, {
    headers,
  });
};

// Fetch Feed
export const fetchFeed = () =>
  axios.get(`${API_URL}/posts/feed`, {
    headers: getAuthHeaders(),
  });

// Fetch Comments
export const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
      headers: getAuthHeaders(),
    });
    console.log("API response for fetchComments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchComments API call:", error);
    throw error;
  }
};

// Fetch Profile
export const fetchProfile = (id) =>
  axios.get(`${API_URL}/user/profile/${id}`, {
    headers: getAuthHeaders(),
  });

// Fetch Post by ID
export const fetchPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`, {
      headers: getAuthHeaders(),
    });
    console.log("API response for fetchPostById:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error in fetchPostById API call:", error);
    throw error;
  }
};

// Update Bio
export const updateBio = async (bio) => {
  return await axios.put(
    `${API_URL}/user/bio`,
    { bio },
    {
      headers: getAuthHeaders(),
    }
  );
};

// Update Profile Picture
export const updateProfilePic = (url) =>
  axios.put(
    `${API_URL}/user/profile-pic`,
    { url },
    {
      headers: getAuthHeaders(),
    }
  );

// Delete Post
export const deletePost = (postId) =>
  axios.delete(`${API_URL}/posts/delete/${postId}`, {
    headers: getAuthHeaders(),
  });

// Logout
export const logout = () =>
  axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

// Like/Unlike Post
export const likePost = async (postId) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/like`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("API response for likePost:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error in likePost API call:", error);
    throw error;
  }
};

// Add Comment
export const addComment = async (postId, comment) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/comment`,
      { content: comment },
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("API response for addComment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in addComment API call:", error);
    throw error;
  }
};

// Delete Comment
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/posts/${postId}/comment/${commentId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("API response for deleteComment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in deleteComment API call:", error);
    throw error;
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/current`, {
      headers: getAuthHeaders(),
    });
    console.log("API response for getCurrentUser:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getCurrentUser API call:", error);
    throw error;
  }
};
