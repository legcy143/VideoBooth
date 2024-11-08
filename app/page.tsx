"use client";
import React, { useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import QRCode from "react-qr-code";

export default function Page() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string | null>(null);
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setVideoFile(file);
    if (file && file.type.startsWith("video/")) {
      const videoBlob = URL.createObjectURL(file);
      setVideoUrl(videoBlob);
    } else {
      alert("Please select a valid video file.");
    }
  };

  const uplaodFile = async (file: File | null) => {
    if (!file) {
      alert("Please select a valid video file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.gokapturehub.com/upload/single",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const currentHostname = `${window.location.protocol}//${window.location.hostname}`;
      const QRString = `${currentHostname}/download/${encodeURIComponent(
        data.data
      )}`;
      setQR(QRString);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-full max-w-md">
        {!qr ? (
          <>
            <h1 className="text-gray-900 font-semibold text-2xl text-center">
              Upload Video to Generate{" "}
              <span className="font-extrabold text-3xl text-gray-500">QR</span>{" "}
              Code
            </h1>
            <>
              {videoUrl ? (
                <>
                  <div className="relative w-full h-96">
                    <ReactPlayer
                      url={videoUrl}
                      controls
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                    />
                  </div>
                  <button
                    onClick={() => uplaodFile(videoFile)}
                    disabled={loading}
                    className="absolute bottom-4 right-4 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg"
                  >
                    {loading ? "Generating QR... Please Wait" : "Generate QR"}
                  </button>
                </>
              ) : (
                <label
                  htmlFor="uploadFile1"
                  className="bg-white text-gray-500 font-semibold text-base rounded-lg w-full h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mt-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-11 mb-2 fill-gray-500"
                    viewBox="0 0 32 32"
                  >
                    <path
                      d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                      data-original="#000000"
                    />
                    <path
                      d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                      data-original="#000000"
                    />
                  </svg>
                  Upload video file
                  <input
                    type="file"
                    id="uploadFile1"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs font-medium text-gray-400 mt-2">
                    MP4, AVI, MKV are allowed.
                  </p>
                </label>
              )}
            </>
          </>
        ) : (
          <>
            <h1 className="text-gray-900 font-semibold text-2xl text-center mb-4">
              Upload Video{" "}
              <span className="font-extrabold text-3xl text-gray-500">QR</span>{" "}
              Code Generated
            </h1>
            <div className="w-full flex flex-col items-center justify-center space-y-2">
              <QRCode value={qr} size={256} />
              <button
                onClick={() => {
                  setQR(null);
                  setVideoUrl(null);
                  setVideoFile(null);
                }}
                className="absolute bottom-4 right-4 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Regenerate QR
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
