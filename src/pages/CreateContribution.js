import React, { useState } from "react";
import { createPost } from "../services/api";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Delete } from "@mui/icons-material";
import exifParser from "exif-parser";
import Pica from "pica";

const CreateContribution = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    walletAddress: "",
    media: [],
  });
  const [mediaFiles, setMediaFiles] = useState([]); // Only store raw files until submit
  const [loading, setLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [metadataArray, setMetadataArray] = useState([]); // Store metadata after submit

  const categories = [
    "Social Welfare",
    "Animal Welfare",
    "Environmental",
    "Innovation",
    "Other",
  ];

  const isValidWalletAddress = (address) => {
    const hexRegex = /^[0-9a-fA-F]{130}$/;
    return hexRegex.test(address);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "walletAddress") {
      if (!isValidWalletAddress(e.target.value)) {
        setWalletError(
          "Invalid wallet address. It should be a 130-character hexadecimal string."
        );
      } else {
        setWalletError("");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }

    const filesArray = Array.from(e.target.files);
    setMediaFiles(filesArray);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
  };

  const processFiles = async () => {
    const resizedFiles = [];
    const allMetadata = [];
    const pica = new Pica();

    // Process all files in parallel
    await Promise.all(
      mediaFiles.map(async (file) => {
        // Extract EXIF metadata
        let exifData = null; // Initialize EXIF data

        // Check if the file type is JPEG before extracting EXIF metadata
        if (file.type === "image/jpeg") {
          const buffer = await file.arrayBuffer();
          const parser = exifParser.create(buffer);
          exifData = parser.parse(); // Only parse EXIF for JPEG
        }

        // Resize the image with aspect ratio preserved
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        await img.decode();

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;

        // Set the max dimensions
        const maxWidth = 1200;
        const maxHeight = 630;

        let targetWidth, targetHeight;

        // Determine the new dimensions while preserving the aspect ratio
        if (img.width / img.height > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = maxWidth / aspectRatio;
        } else {
          targetHeight = maxHeight;
          targetWidth = maxHeight * aspectRatio;
        }

        // Create the canvas with the new dimensions
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;

        await pica.resize(img, resizedCanvas);
        const outputFormat = file.type;

        const resizedImageBlob = await pica.toBlob(
          resizedCanvas,
          outputFormat,
          0.9
        );

        resizedFiles.push(
          new File([resizedImageBlob], file.name, { type: file.type })
        );

        // Collect metadata
        allMetadata.push({
          filename: file.name,
          exif: exifData ? exifData.tags : null,
        });
      })
    );

    return { resizedFiles, allMetadata };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidWalletAddress(formData.walletAddress)) {
      setWalletError("Please enter a valid wallet address.");
      return;
    }

    setLoading(true);

    try {
      const { resizedFiles, allMetadata } = await processFiles(); // Process the files before submission

      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      resizedFiles.forEach((file) => {
        formDataToSend.append("media", file);
      });

      // Send metadata as JSON string
      formDataToSend.append("metadata", JSON.stringify(allMetadata));

      // Create post on the platform
      const response = await createPost(formDataToSend, token);
      console.log("Post created:", response.data);
      alert(
        "Contribution created successfully on both platform and blockchain!"
      );
    } catch (error) {
      console.error(
        "Error creating post or recording blockchain contribution:",
        error
      );
      alert("Failed to create contribution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundColor: "white",
        my: 12,
        py: 5,
        border: "solid 3px black",
        borderRadius: 4,
        boxShadow: 3,
        width: "90%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "2.05rem",
            fontWeight: "bold",
          }}
          variant="h4"
          align="center"
          gutterBottom
        >
          Create Contribution
        </Typography>
        <EmojiPeopleIcon
          fontSize="large"
          sx={{ fontSize: "3rem", color: "#6b62f4" }}
        />
      </Box>

      <Grid
        component="form"
        container
        spacing={3}
        mt={1}
        sx={{ px: 2 }}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title and Category */}
        <Grid item xs={12} md={7}>
          <FormControl fullWidth>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={5}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              variant="outlined"
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Description */}
        <Grid item xs={12} md={7}>
          <FormControl fullWidth>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={6}
              required
              variant="outlined"
              borderRadius={3}
            />
          </FormControl>
        </Grid>

        {/* Location and Wallet Address */}

        <Grid item xs={12} md={5}>
          <FormControl fullWidth>
            <TextField
              label="Your Wallet Address"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              multiline
              rows={6}
              required
              variant="outlined"
              error={!!walletError}
              helperText={walletError}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={7}>
          <FormControl fullWidth>
            <TextField
              label="Where did this take place?"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </FormControl>
        </Grid>

        {/* Upload Media and Create Button */}
        <Grid item xs={12} md={5}>
          <input
            id="media-upload"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="media-upload">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton
                color="primary"
                component="span"
                disabled={loading}
                sx={{
                  alignItems: "center",
                  backgroundColor: "#ff006a",
                  color: "white",
                  p: 1.2,
                  "&:hover": {
                    backgroundColor: "#e0005e",
                  },
                }}
              >
                <AttachFileIcon
                  sx={{ fontSize: "1.9rem", stroke: "white", strokeWidth: 0.6 }}
                />
              </IconButton>
              <Typography fontWeight={600} sx={{ color: "grey" }}>
                Upload Files
              </Typography>
            </Box>
          </label>
        </Grid>

        <Grid
          item
          xs={12}
          md={12}
          mt={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              fontFamily: "monospace",
              fontSize: "1.1rem",
              py: 1,
              width: "40%",
              border: "solid 1px black",
              borderRadius: 3,
              color: "black",
              backgroundColor: "#6eeeab",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { color: "white", backgroundColor: "black" },
            }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Submit"}
          </Button>
        </Grid>

        {/* Media File List */}
        {mediaFiles.length > 0 && (
          <Grid item xs={12}>
            <Typography>Selected Files:</Typography>
            <List>
              {mediaFiles.map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: 1,
                    mb: 1,
                    pl: 2,
                  }}
                >
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CreateContribution;
