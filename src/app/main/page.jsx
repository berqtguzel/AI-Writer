"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FiLogOut, FiTrash2 } from "react-icons/fi"; // Çıkış ve silme ikonları için react-icons'dan import
import {
  saveSearch,
  fetchSearchHistory,
  deleteSearch,
} from "../../../firebaseDatabase"; // Firebase Database fonksiyonları

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentChatHistory, setCurrentChatHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchSearchHistory(setHistory);
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
      const newHistoryItem = {
        id: Date.now().toString(),
        input,
        response: data.result,
      };
      setCurrentChatHistory([...currentChatHistory, newHistoryItem]);

      // Firebase Database'e kaydet
      await saveSearch(input, data.result);
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
    router.push("/login");
  };

  const handleNewChat = () => {
    setHistory([...history, ...currentChatHistory]);
    setCurrentChatHistory([]);
    setInput("");
    setResponse("");
  };

  const handleSelectHistory = (item) => {
    setInput(item.input);
    setResponse(item.response);
    setCurrentChatHistory([item]);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteSearch(id);
      const updatedHistory = history.filter((item) => item.id !== id);
      setHistory(updatedHistory);
    } catch (err) {
      console.error("Hata detayı:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-lg font-semibold text-orange-500 mb-4">
          Geçmiş Aramalar
        </h2>
        <div className="space-y-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-2 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
            >
              <p
                className="text-sm text-gray-300"
                onClick={() => handleSelectHistory(item)}
              >
                {item.input}
              </p>
              <button
                onClick={() => handleDeleteHistory(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-between p-10">
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-4xl font-bold mb-6 text-center text-orange-500">
            AI-Writer
          </h1>
          <div className="space-y-4 mb-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {currentChatHistory.map((item, index) => (
              <div key={index} className="p-4 rounded-lg shadow-sm">
                <div className="bg-gray-800 p-4 rounded-lg mb-2">
                  <h2 className="text-lg font-semibold text-orange-500">
                    Siz:
                  </h2>
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

        <div className="fixed bottom-4 right-4 flex flex-col space-y-4">
          <button
            onClick={handleLogout}
            className="p-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>

          <button
            onClick={handleNewChat}
            className="p-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <span>Yeni Chat</span>
          </button>
        </div>
      </div>

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
