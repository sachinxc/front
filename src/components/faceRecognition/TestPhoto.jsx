import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Input } from "@mui/material";
import { styled } from "@mui/system";
import useFaceApiModels from "../../hooks/useFaceApiModels";
import useFaceMatcher from "../../hooks/useFaceMatcher";
import useFaceDetection from "../../hooks/useFaceDetection"; // Import the custom hook
import * as faceapi from "face-api.js";

const TestPhotoScreen = styled(Box)({
  textAlign: "center",
  minheight: "50vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const Title = styled(Typography)({
  fontSize: "28px",
  fontWeight: "bold",
  color: "#3f51b5",
  marginBottom: "20px",
});

const UploadInput = styled(Input)({
  display: "none",
});

const UploadLabel = styled("label")({
  padding: "12px 24px",
  backgroundColor: "#3f51b5",
  color: "#fff",
  fontSize: "16px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  marginBottom: "20px",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const ImageContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
});

const ResizedImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "60vh",
  height: "auto",
  borderRadius: "10px",
});

const ActionButton = styled(Button)({
  padding: "12px 24px",
  backgroundColor: "#3f51b5",
  color: "#fff",
  fontSize: "16px",
  borderRadius: "8px",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const TestPhoto = () => {
  const [imageURL, setImageURL] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const imgRef = useRef(null);
  const modelsLoaded = useFaceApiModels();
  const faceMatcher = useFaceMatcher();
  const { canvasRef, detectFaces } = useFaceDetection(faceMatcher);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const image = await faceapi.bufferToImage(file);
    setUploadedImage(image);
    setImageURL(URL.createObjectURL(file));
    console.log("Image uploaded:", image);
  };

  const updateCanvasSize = () => {
    const canvasElement = canvasRef.current;
    const imageElement = imgRef.current;

    if (canvasElement && imageElement) {
      const rect = imageElement.getBoundingClientRect();
      canvasElement.width = rect.width;
      canvasElement.height = rect.height;
      canvasElement.style.width = `${rect.width}px`;
      canvasElement.style.height = `${rect.height}px`;
      canvasElement.style.top = `${imageElement.offsetTop}px`;
      canvasElement.style.left = `${imageElement.offsetLeft}px`;
      canvasElement.style.position = "absolute";
      canvasElement.style.zIndex = 1;
      canvasElement.style.pointerEvents = "none";

      console.log("Canvas size and position updated:", {
        width: rect.width,
        height: rect.height,
        top: imageElement.offsetTop,
        left: imageElement.offsetLeft,
      });
    } else {
      console.log("Canvas or image element not found.");
    }
  };

  const handleDetectFromPhoto = () => {
    if (!modelsLoaded) {
      console.log("Models not loaded yet.");
      return;
    }

    if (uploadedImage) {
      detectFaces(uploadedImage);
    } else {
      console.log("Image not available for detection.");
    }
  };

  useEffect(() => {
    if (uploadedImage) {
      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [uploadedImage]);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = updateCanvasSize;
    }
  }, [imageURL]);

  return (
    <TestPhotoScreen>
      <Title>Test Photo</Title>
      <UploadInput
        type="file"
        accept="image/*"
        id="upload-photo"
        onChange={handlePhotoUpload}
      />
      <UploadLabel htmlFor="upload-photo">Upload Photo</UploadLabel>
      {imageURL && (
        <ImageContainer>
          <ResizedImage src={imageURL} alt="Uploaded" ref={imgRef} />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </ImageContainer>
      )}
      <ActionButton variant="contained" onClick={handleDetectFromPhoto}>
        Detect Faces from Photo
      </ActionButton>
    </TestPhotoScreen>
  );
};

export default TestPhoto;
