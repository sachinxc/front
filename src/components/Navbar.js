import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout(token);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#404040",
        boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        px: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side: System Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/feed"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
            mr: 2,
          }}
        >
          Action Chain
        </Typography>

        {/* Right Side: Buttons or Menu Icon */}
        {isSmallScreen ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              sx={{
                "&:hover": {
                  backgroundColor: "white",
                  color: "#333",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "calc(100vh - 100px)",
                    overflow: "auto",
                    marginTop: "8px",
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "right",
                },
              }}
            >
              <MenuItem component={Link} to="/feed" onClick={handleMenuClose}>
                <HomeIcon sx={{ marginRight: 1 }} /> Home
              </MenuItem>
              {token && userId && (
                <MenuItem
                  component={Link}
                  to={`/profile/${userId}`}
                  onClick={handleMenuClose}
                >
                  <PersonIcon sx={{ marginRight: 1 }} /> Profile
                </MenuItem>
              )}
              {token && (
                <>
                  <MenuItem
                    component={Link}
                    to="/create"
                    onClick={handleMenuClose}
                  >
                    <AddCircleIcon sx={{ marginRight: 1 }} /> Contribute
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/blockchain"
                    onClick={handleMenuClose}
                  >
                    <GridViewRoundedIcon sx={{ marginRight: 1 }} /> Blockchain
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}
                  >
                    <ExitToAppIcon sx={{ marginRight: 1 }} /> Logout
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {token && (
              <Button
                color="inherit"
                component={Link}
                to="/create"
                startIcon={<AddCircleIcon />}
                sx={{
                  fontWeight: "bold",
                  border: "3px solid #62f4b8",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#333",
                  },
                }}
              >
                Contribute
              </Button>
            )}
            {token && (
              <Button
                color="inherit"
                component={Link}
                to="/blockchain"
                startIcon={
                  <GridViewRoundedIcon
                    sx={{
                      color: "#00d2ff",
                    }}
                  />
                }
                sx={{
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#333",
                  },
                }}
              >
                Blockchain
              </Button>
            )}
            <IconButton
              color="inherit"
              component={Link}
              to="/feed"
              sx={{
                "&:hover": {
                  backgroundColor: "white",
                  color: "#333",
                },
              }}
            >
              <HomeIcon />
            </IconButton>
            {token && userId && (
              <IconButton
                color="inherit"
                component={Link}
                to={`/profile/${userId}`}
                sx={{
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#333",
                  },
                }}
              >
                <PersonIcon />
              </IconButton>
            )}
            {token && (
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#333",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
