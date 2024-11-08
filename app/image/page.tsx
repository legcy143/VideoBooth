"use client";
import React, { useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import QRCode from "react-qr-code";
import ImageUpload from "./_components/ImageUpload";

export default function Page() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [qr, setQR] = useState<string | null>(null);

  const uplaodFile = async (file: File | null) => {
    if (!file) {
      alert("Invalid Image File");
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
      const QRString = `${currentHostname}/download/image/${
        data.data
      }`;
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
              Upload Image to Generate{" "}
              <span className="font-extrabold text-3xl text-gray-500">QR</span>{" "}
              Code
            </h1>
            <ImageUpload
              onUpload={(e) => {
                setImageFile(e?.[0]);
              }}
              onRemove={() => {
                setImageUrl(null);
                setImageFile(null);
              }}
              preview={imageUrl ?? ""}
              title="Upload image"
            />
            {imageFile && (
              <button
                onClick={() => uplaodFile(imageFile)}
                disabled={loading}
                className="absolute bottom-4 right-4 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg"
              >
                {loading ? "Generating QR... Please Wait" : "Generate QR"}
              </button>
            )}
          </>
        ) : (
          <>
            <h1 className="text-gray-900 font-semibold text-2xl text-center mb-4">
              Upload Image{" "}
              <span className="font-extrabold text-3xl text-gray-500">QR</span>{" "}
              Code Generated
            </h1>
            <div className="w-full flex flex-col items-center justify-center space-y-2">
              <QRCode value={qr} size={256} />
              <button
                onClick={() => {
                  setQR(null);
                  setImageUrl(null);
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
