import React from "react";
import {
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const Home = () => {
  return (
    <div>
      {/* Main Content */}
      <Container sx={{ marginTop: 16 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Welcome to the Home Page!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Explore our features and learn more about what we offer.
        </Typography>

        {/* Grid of Cards */}
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/300x200?sig=${index}`}
                  alt="Random"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Feature {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover this amazing feature and see how it can benefit
                    you.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Container sx={{ textAlign: "center", marginTop: 6 }}>
          <Button variant="contained" color="secondary" size="large">
            Get Started Now
          </Button>
        </Container>
      </Container>
    </div>
  );
};

export default Home;
