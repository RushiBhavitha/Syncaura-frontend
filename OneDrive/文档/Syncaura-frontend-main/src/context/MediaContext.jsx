import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCameraAndMic,
  toggleAudioTrack,
  toggleVideoTrack,
  stopAllTracks,
  getScreenStream,
} from "../services/mediaService";

const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const checkDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      hasMic: devices.some((d) => d.kind === "audioinput"),
      hasCamera: devices.some((d) => d.kind === "videoinput"),
    };
  };

  // 🎥 Start Camera + Mic
  const startMedia = async () => {
    const { hasMic, hasCamera } = await checkDevices();

    if (!hasMic && !hasCamera) {
      setIsMicOn(false);
      setIsCameraOn(false);
      throw new Error("no-devices");
    }

    try {
      const stream = await getCameraAndMic();
      setLocalStream(stream);
    } catch (err) {
      setIsMicOn(false);
      setIsCameraOn(false);
      throw new Error("permission-denied");
    }
  };

  // 🎤 Toggle Mic
  const toggleMic = () => {
    console.log("Toggle Mic clicked");
    console.log(localStream);

    if (!localStream) return;

    toggleAudioTrack(localStream, !isMicOn);
    setIsMicOn((prev) => !prev);
  };

  // 📷 Toggle Camera
  const toggleCamera = () => {
    console.log("Toggle Camera clicked");

    if (!localStream) return;

    toggleVideoTrack(localStream, !isCameraOn);
    setIsCameraOn((prev) => !prev);
  };

  // 🖥 Start Screen Share
  const startScreenShare = async () => {
    try {
      const stream = await getScreenStream();

      setScreenStream(stream);
      setIsScreenSharing(true);

      // When user clicks "Stop sharing" from browser popup
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share cancelled:", err);
      setIsScreenSharing(false);
    }
  };

  const stopScreenShare = () => {
    setScreenStream((prev) => {
      if (prev) {
        stopAllTracks(prev);
      }
      return null;
    });

    setIsScreenSharing(false);
  };

  // 🔥 Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (localStream) stopAllTracks(localStream);
      if (screenStream) stopAllTracks(screenStream);
    };
  }, [localStream, screenStream]);

  return (
    <MediaContext.Provider
      value={{
        localStream,
        screenStream,
        isMicOn,
        isCameraOn,
        isScreenSharing,
        startMedia,
        toggleMic,
        toggleCamera,
        startScreenShare,
        stopScreenShare,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => useContext(MediaContext);
