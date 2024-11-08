"use client";
import { useState } from "react";
import ReactPlayer from "react-player";

export default function page({ params }: { params: { videoURL: string } }) {
  const [loading, setLoading] = useState(false);
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-full max-w-md">
        <h1 className="text-gray-900 font-semibold text-2xl text-center">
          Download Your
          <span className="font-extrabold text-3xl text-gray-500">Video</span>
        </h1>
        <>
          <div className="relative w-full h-96">
            <ReactPlayer
              url={decodeURIComponent(params.videoURL)}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
            />
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const response = await fetch(
                  decodeURIComponent(params.videoURL)
                );
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "video.mp4";
                a.click();
              } catch (error) {
                console.error("Error downloading the video:", error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="absolute bottom-4 right-4 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg"
          >
            {loading ? "Downloading..." : "Download"}
          </button>
        </>
      </div>
    </main>
  );
}
