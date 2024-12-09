import React from "react";
import { Box, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#404040",
        color: "white",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
        © 2024 Action Chain. Made with Love.
      </Typography>
      <Box>
        <Link
          href="/privacy-policy"
          sx={{
            color: "white",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link
          href="/terms"
          sx={{
            color: "white",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
