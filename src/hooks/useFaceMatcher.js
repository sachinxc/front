import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const useFaceMatcher = () => {
  const [faceMatcher, setFaceMatcher] = useState(null);

  useEffect(() => {
    const loadStoredFaces = async () => {
      try {
        // Get the JWT token from local storage
        const token = localStorage.getItem("token");

        // Check if the token is available
        if (!token) {
          throw new Error("Authentication token is missing");
        }

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

        // Assuming the `descriptor` is already an array, no need to JSON.parse it again
        const labeledDescriptors = faces.map((face) => {
          return new faceapi.LabeledFaceDescriptors(face.label, [
            new Float32Array(face.descriptor),
          ]);
        });

        setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.6));
        console.log("Loaded stored faces:", faces);
      } catch (error) {
        console.error("Failed to fetch faces:", error);
      }
    };

    loadStoredFaces();
  }, []);

  return faceMatcher;
};

export default useFaceMatcher;
