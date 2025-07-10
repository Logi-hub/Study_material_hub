"use client";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-300"
      >
        <Home size={20} />
        Go to Home
      </button>
    </div>
  );
}
