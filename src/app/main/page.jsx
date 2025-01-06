"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; // Çıkış ikonu için react-icons'dan import

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    if (savedHistory.length > 0) setHistory(savedHistory);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorData}`
        );
      }

      const data = await res.json();
      setResponse(data.result);
      const newHistory = [...history, { input, response: data.result }];
      setHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Hata detayı:", err);
      setError(`Hata: ${err.message}`);
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    localStorage.removeItem("history");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-10">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-orange-500">
          AI-Writer
        </h1>
        <div className="space-y-4 mb-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {history.map((item, index) => (
            <div key={index} className="p-4 rounded-lg shadow-sm">
              <div className="bg-gray-800 p-4 rounded-lg mb-2">
                <h2 className="text-lg font-semibold text-orange-500">Siz:</h2>
                <p className="mt-2">{item.input}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-orange-500">
                  Yapay Zeka:
                </h2>
                <p className="mt-2">{item.response}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex space-x-4 fixed bottom-0 left-0 w-full bg-black p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-4 border border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-800 text-white"
            placeholder="Sorunuzu yazın..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`py-3 px-6 rounded-lg text-white font-semibold ${
              isLoading ? "bg-gray-500" : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="fixed top-0 left-0 m-4 p-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out flex items-center space-x-2"
      >
        <FiLogOut className="h-5 w-5" />
        <span>Çıkış Yap</span>
      </button>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ff6600;
          border-radius: 6px;
          border: 3px solid #1a1a1a;
        }
      `}</style>
    </div>
  );
}
