import { useRef, useCallback } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (faceMatcher = null) => {
  const canvasRef = useRef(null);

  const detectFaces = useCallback(
    async (input, callback = () => {}) => {
      if (!canvasRef.current) {
        console.error("Canvas is not available");
        return;
      }

      console.log("Starting face detection on input:", input);

      const detections = await faceapi
        .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      console.log("Detections:", detections);

      const resizedDetections = faceapi.resizeResults(detections, {
        width: input.width || input.videoWidth,
        height: input.height || input.videoHeight,
      });

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = input.width || input.videoWidth;
      canvas.height = input.height || input.videoHeight;

      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      if (faceMatcher) {
        resizedDetections.forEach((detection) => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          console.log(
            `Best match: ${bestMatch.label} (${bestMatch.distance.toFixed(2)})`
          );
          const { x, y, width, height } = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(
            { x, y, width, height },
            { label: `${bestMatch.label} (${bestMatch.distance.toFixed(2)})` }
          );
          drawBox.draw(canvas);
        });
      } else {
        console.warn("No face matcher available for recognition.");
      }

      callback(detections); // Optional callback to perform additional actions with detections
    },
    [faceMatcher]
  );

  return { canvasRef, detectFaces };
};

export default useFaceDetection;
