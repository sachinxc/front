import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import useFaceApiModels from "../../hooks/useFaceApiModels";
import useFaceMatcher from "../../hooks/useFaceMatcher";
import useFaceDetection from "../../hooks/useFaceDetection"; // Import the custom hook

const TestCameraScreen = styled(Box)({
  textAlign: "center",
  padding: "20px",
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const Title = styled(Typography)({
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#3f51b5",
});

const VideoContainer = styled(Box)({
  position: "relative",
  width: "100%",
  maxWidth: "800px",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
});

const VideoPreview = styled("video")({
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "10px",
});

const ActionButton = styled(Button)({
  padding: "12px 24px",
  backgroundColor: "#3f51b5",
  color: "#fff",
  fontSize: "16px",
  borderRadius: "8px",
  marginTop: "30px",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const Test = () => {
  const videoRef = useRef();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const streamRef = useRef(null); // Reference to the media stream
  const modelsLoaded = useFaceApiModels(); // Use the custom hook to load models
  const faceMatcher = useFaceMatcher(); // Use the custom hook to load stored faces
  const { canvasRef, detectFaces } = useFaceDetection(faceMatcher); // Use the face detection hook

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      // Stop the media stream and release the webcam when the component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        streamRef.current = stream; // Store the stream in the ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  const handleToggleRecognition = () => {
    if (isRecognizing) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsRecognizing(false);
    } else {
      const id = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          detectFaces(videoRef.current);
        }
      }, 100);

      setIntervalId(id);
      setIsRecognizing(true);
    }
  };

  return (
    <TestCameraScreen>
      {!modelsLoaded ? (
        <CircularProgress />
      ) : (
        <>
          <Title>Real-time Face Recognition</Title>
          <VideoContainer>
            <VideoPreview ref={videoRef} autoPlay muted />
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
          </VideoContainer>
          <ActionButton variant="contained" onClick={handleToggleRecognition}>
            {isRecognizing ? "Stop Recognition" : "Start Recognition"}
          </ActionButton>
        </>
      )}
    </TestCameraScreen>
  );
};

export default Test;
