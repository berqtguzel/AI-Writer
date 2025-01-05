"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Token'ı çerezlere kaydet
      Cookies.set("authToken", token, { expires: 1 });

      router.push("/main");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      alert("Google ile giriş başarısız.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Hoşgeldin
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Devam etmek için giriş yap
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"></span>
            ) : (
              <svg
                className="h-6 w-6 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.6 0 6.8 1.2 9.4 3.4l7-7C34.8 1.8 29.8 0 24 0 14.7 0 6.9 5.8 3.2 14.3l7.9 6.1C13.1 14.2 18.2 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9.6h12.6c-.6 3-2.4 5.6-4.9 7.3l7.8 6c4.5-4.2 7.1-10.4 7.1-17.2z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.9 28.5c-1-3-1.5-6.2-1.5-9.5s.5-6.5 1.5-9.5l-7.9-6.1C1 10.5 0 17.1 0 24s1 13.5 2.9 19.5l7.9-6c-.9-2.9-1.4-6.1-1.4-9.5z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c5.8 0 10.8-1.8 14.9-4.9l-7.8-6c-2.3 1.6-5.3 2.5-8.5 2.5-5.8 0-10.9-3.8-12.8-9.1l-7.9 6.1C6.9 42.2 14.7 48 24 48z"
                />
              </svg>
            )}
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
