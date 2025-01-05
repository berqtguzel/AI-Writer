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
    <div>
      <h1>Login Page</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Google ile Giriş Yap"}
      </button>
    </div>
  );
}
