import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";

const ManageFacesScreen = styled(Box)({
  textAlign: "center",
  padding: "20px",
});

const Title = styled(Typography)({
  marginTop: "30px",
  fontSize: "24px",
  fontWeight: "bold",
});

const FacesList = styled(List)({
  listStyle: "none",
  padding: "0",
  marginTop: "20px",
  maxWidth: "500px",
  margin: "0 auto",
});

const FaceItem = styled(ListItem)({
  margin: "15px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 15px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
});

const FaceLabel = styled(Typography)({
  fontSize: "18px",
  color: "#333",
});

const DeleteButton = styled(Button)({
  padding: "6px 12px",
  backgroundColor: "#f44336",
  color: "#fff",
  fontSize: "14px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#d32f2f",
  },
});

const ManageFaces = () => {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [faceToDelete, setFaceToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    loadStoredFaces();
  }, []);

  const loadStoredFaces = async () => {
    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem("token");

      // Make the fetch request with the Authorization header
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/faces`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const faces = await response.json();
      setFaces(faces);
    } catch (error) {
      setError("Failed to load faces. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFace = async (id) => {
    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem("token");

      // Make the DELETE request with the Authorization header
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/faces/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (response.ok) {
        setFaces(faces.filter((face) => face.id !== id));
        setSnackbarOpen(true);
      } else {
        setError("Error deleting face. Please try again.");
      }
    } catch (error) {
      setError("Failed to delete face. Please try again later.");
    } finally {
      setOpenDialog(false);
      setFaceToDelete(null);
    }
  };

  const confirmDelete = (face) => {
    setFaceToDelete(face);
    setOpenDialog(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <ManageFacesScreen>
      <Title>Registered Face List</Title>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <FacesList>
          {faces.map((face) => (
            <FaceItem key={face.id}>
              <FaceLabel>{face.label}</FaceLabel>
              <DeleteButton
                variant="contained"
                onClick={() => confirmDelete(face)}
              >
                Delete
              </DeleteButton>
            </FaceItem>
          ))}
        </FacesList>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{faceToDelete?.label}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteFace(faceToDelete?.id)}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message="Face deleted successfully"
      />
    </ManageFacesScreen>
  );
};

export default ManageFaces;
