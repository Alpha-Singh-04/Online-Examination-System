import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const WebcamMonitor = ({ onViolation }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models"); // Load model
        console.log("Face detection model loaded.");
        startWebcam();
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }

        setInterval(() => {
          captureFrame();
        }, 30000); // Capture every 30 seconds

      } catch (error) {
        console.error("Error accessing webcam:", error);
        onViolation("WEBCAM_ACCESS", "Failed to access webcam");
      }
    };

    loadModels();

    return () => {
      if (webcamRef.current?.srcObject) {
        webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = async () => {
    if (!webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    console.log("Face Detections:", detections);

    if (detections.length === 0) {
      onViolation("NO_FACE_DETECTED", "No face detected in the frame.");
    }

    sendImageToBackend(canvas.toDataURL("image/jpeg"));
  };

  const sendImageToBackend = async (imageData) => {
    try {
      await fetch("http://your-backend-url/api/face-recognition", {
        method: "POST",
        body: JSON.stringify({ image: imageData }),
        headers: { "Content-Type": "application/json" },
      });
      console.log("Image sent to backend for verification.");
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  return (
    <div className="hidden">
      <video ref={webcamRef} autoPlay playsInline muted style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default WebcamMonitor;
