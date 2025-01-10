"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc"; // Google ikonu için react-icons'dan import

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      Cookies.set("authToken", token, { expires: 1 });

      router.push("/main");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      alert("Google ile giriş başarısız.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-orange-400 drop-shadow-lg">
          AI-Writer'e Hoşgeldin
        </h1>
        <p className="text-center text-gray-300 text-lg mb-8">
          Devam etmek için giriş yap
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"></span>
            ) : (
              <FcGoogle className="h-6 w-6 mr-3" />
            )}
            {loading ? "Giriş yapılıyor..." : "Google ile Giriş Yap"}
          </button>
        </div>
      </div>
    </div>
  );
}
