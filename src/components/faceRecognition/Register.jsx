import React, { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import useFaceApiModels from "../../hooks/useFaceApiModels";
import useFaceDetection from "../../hooks/useFaceDetection";

const RegisterScreen = styled(Box)({
  textAlign: "center",
  padding: "20px",
});

const Instructions = styled(Typography)({
  marginTop: "20px",
  marginBottom: "20px",
  fontSize: "18px",
});

const NameInputSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "20px",
});

const NameInput = styled(TextField)({
  padding: "5px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "60%",
  maxWidth: "300px",
  marginBottom: "10px",
});

const ErrorMessage = styled(Typography)({
  color: "red",
  marginBottom: "10px",
});

const ActionButton = styled(Button)({
  padding: "10px 20px",
  backgroundColor: "#3f51b5",
  color: "#fff",
  fontSize: "16px",
  borderRadius: "8px",
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const VideoSection = styled(Box)({
  textAlign: "center",
  marginTop: "20px",
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
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
});

const Register = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isReadyToRegister, setIsReadyToRegister] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const videoRef = useRef();
  const streamRef = useRef(null);
  const intervalRef = useRef();
  const modelsLoaded = useFaceApiModels();
  const { canvasRef, detectFaces } = useFaceDetection(); // Use the face detection hook

  useEffect(() => {
    if (isReadyToRegister && modelsLoaded) {
      startVideo();
      startDetection();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isReadyToRegister, modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        streamRef.current = stream; // Store the stream in the ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => setError("Error accessing webcam. Please try again."));
  };

  const handleNext = () => {
    if (!name.trim()) {
      setError("Please enter your name to proceed.");
    } else {
      setError("");
      setIsReadyToRegister(true);
    }
  };

  const startDetection = () => {
    intervalRef.current = setInterval(() => {
      if (videoRef.current) {
        detectFaces(videoRef.current);
      }
    }, 100);
  };

  const handleRegister = async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) return;

    setIsRegistering(true);
    clearInterval(intervalRef.current);

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setError("No face detected. Please make sure your face is visible.");
      setIsRegistering(false);
      startDetection();
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          body: JSON.stringify({ label: name.trim(), descriptor }),
        }
      );

      if (response.ok) {
        console.log(`Registered: ${name}`);
        setTimeout(onSuccess, 1500);
      } else {
        setError("Error registering face. Please try again.");
      }
    } catch (error) {
      setError("Failed to register face. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <RegisterScreen>
      {!isReadyToRegister ? (
        <NameInputSection>
          <Instructions>Please enter your name to proceed:</Instructions>
          <NameInput
            variant="outlined"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ActionButton variant="contained" onClick={handleNext}>
            Next
          </ActionButton>
        </NameInputSection>
      ) : (
        <VideoSection>
          <Instructions>
            Look directly into the camera and press Register
          </Instructions>
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
          {modelsLoaded ? (
            <>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <ActionButton
                variant="contained"
                onClick={handleRegister}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </ActionButton>
            </>
          ) : (
            <CircularProgress />
          )}
        </VideoSection>
      )}
    </RegisterScreen>
  );
};

export default Register;
