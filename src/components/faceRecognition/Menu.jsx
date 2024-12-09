import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";

const MenuScreen = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginTop: "100px",
  padding: "0 20px",
  [theme.breakpoints.down("sm")]: {
    marginTop: "100px",
  },
}));

const MenuButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    gap: "10px",
  },
}));

const MenuButton = styled(Button)({
  padding: "12px 25px",
  fontSize: "16px",
  borderRadius: "8px",
  fontWeight: "bold",
  color: "#fff",
  transition: "background-color 0.3s ease, transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const RegisterFaceButton = styled(MenuButton)({
  backgroundColor: "#6a1b9a",
  "&:hover": {
    backgroundColor: "#4a148c",
  },
});

const TestButton = styled(MenuButton)({
  backgroundColor: "#388e3c",
  "&:hover": {
    backgroundColor: "#2e7d32",
  },
});

const TestPhotoButton = styled(MenuButton)({
  backgroundColor: "#0288d1",
  "&:hover": {
    backgroundColor: "#0277bd",
  },
});

const ManageFacesButton = styled(MenuButton)({
  backgroundColor: "#fbc02d",
  "&:hover": {
    backgroundColor: "#f9a825",
  },
});

const Menu = ({ onTest, onTestPhoto, onManageFaces, onRegister }) => (
  <MenuScreen>
    <MenuButtons>
      <RegisterFaceButton variant="contained" onClick={onRegister}>
        Register Face
      </RegisterFaceButton>
      <TestButton variant="contained" onClick={onTest}>
        Test
      </TestButton>
      <TestPhotoButton variant="contained" onClick={onTestPhoto}>
        Test Photo
      </TestPhotoButton>
      <ManageFacesButton variant="contained" onClick={onManageFaces}>
        Manage Faces
      </ManageFacesButton>
    </MenuButtons>
  </MenuScreen>
);

export default Menu;
