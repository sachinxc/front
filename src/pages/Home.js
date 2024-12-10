import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Typography, Container, Button } from "@mui/material";

const Home = () => {
  return (
    <div>
      {/* Main Content */}
      <Container sx={{ mt: 20, mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: "#000000", fontWeight: "600" }}
        >
          Welcome to the Action Chain!
        </Typography>
        <Typography
          align="center"
          gutterBottom
          sx={{
            fontFamily: "monospace",
            fontSize: "2.5rem",
            color: "white",
            fontWeight: "600",
            mt: 8,
          }}
        >
          Recognize, Reward and Empower using Blockchain & AI
        </Typography>

        {/* Call to Action */}
        <Container sx={{ textAlign: "center", marginTop: 6 }}>
          <Link to="/signup" component={RouterLink}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                color: "white",
                backgroundColor: "black",
                fontWeight: "bold",
                fontSize: "1.4rem",
              }}
            >
              Join Now!
            </Button>
          </Link>
        </Container>
      </Container>
    </div>
  );
};

export default Home;
