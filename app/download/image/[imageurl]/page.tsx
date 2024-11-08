"use client";
import { useState } from "react";

export default function Page({ params }: { params: { imageUrl: string } }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(params.imageUrl, { mode: 'cors' }); // Ensure CORS policy allows this
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "image.jpg"; // Ensure a file extension is specified
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up URL object after download
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-full max-w-md">
        <h1 className="text-gray-900 font-semibold text-2xl text-center">
          Download Your <span className="font-extrabold text-3xl text-gray-500">Image</span>
        </h1>
        <div className="relative w-full h-96 max-h-[90vh]">
          <img src={params.imageUrl} alt="Downloaded content" className="object-cover w-full h-full" />
        </div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="mt-4 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg"
        >
          {loading ? "Downloading..." : "Download"}
        </button>
      </div>
    </main>
  );
}
