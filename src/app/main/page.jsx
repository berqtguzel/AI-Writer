"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { RiChat4Fill } from "react-icons/ri";
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
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [lastSearchDate, setLastSearchDate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSearchHistory(setHistory);

    // Yerel depolamadan arama sayısını ve son arama tarihini yükleyin
    const storedSearchCount = localStorage.getItem("searchCount");
    const storedLastSearchDate = localStorage.getItem("lastSearchDate");

    if (storedSearchCount) {
      setSearchCount(parseInt(storedSearchCount, 10));
    }

    if (storedLastSearchDate) {
      setLastSearchDate(new Date(storedLastSearchDate));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("searchCount", searchCount);
    localStorage.setItem("lastSearchDate", lastSearchDate);
  }, [searchCount, lastSearchDate]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Günlük arama limitini kontrol edin
    const now = new Date();
    if (
      lastSearchDate &&
      now.toDateString() !== new Date(lastSearchDate).toDateString()
    ) {
      // Yeni bir gün, arama sayısını sıfırlayın
      setSearchCount(0);
      setLastSearchDate(now);
    }

    if (searchCount >= 5) {
      setError("Günlük arama limitinizi aştınız. Lütfen yarın tekrar deneyin.");
      return;
    }

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
      setHistory([...history, newHistoryItem]);
      setCurrentChatHistory([...currentChatHistory, newHistoryItem]);

      // Firebase Database'e kaydet
      await saveSearch(input, data.result);

      // Arama yapıldıktan sonra input alanını devre dışı bırak
      setIsSearchDisabled(true);

      // Arama sayısını artırın ve son arama tarihini güncelleyin
      setSearchCount(searchCount + 1);
      setLastSearchDate(now);
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
    if (currentChatHistory.length > 1) {
      setHistory([...history, ...currentChatHistory.slice(0, -1)]);
    }
    setCurrentChatHistory([]);
    setInput("");
    setResponse("");
    setIsSearchDisabled(false); // Yeni sohbet başlatıldığında input alanını etkinleştir
  };

  const handleSelectHistory = (item) => {
    setInput(item.input);
    setResponse(item.response);
    setCurrentChatHistory([item]);
    setIsSearchDisabled(true); // Geçmiş aramalardan birine tıklandığında input alanını devre dışı bırak
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteSearch(id);
      const updatedHistory = history.filter((item) => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Hata detayı:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-black to-gray-900 text-white flex flex-col md:flex-row">
      <div className="w-full md:w-72 bg-gray-700 p-6 rounded-lg m-4 flex flex-col justify-between shadow-lg">
        <h2 className="text-lg font-bold text-orange-500 mb-4">
          Geçmiş Aramalar
        </h2>
        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-grow">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-gray-600 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-500"
            >
              <p
                className="text-sm text-gray-300 truncate w-4/5"
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
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <button
            onClick={handleLogout}
            className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 flex items-center space-x-2 text-sm"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>

          <button
            onClick={handleNewChat}
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 flex items-center space-x-2 text-sm"
          >
            <RiChat4Fill className="h-4 w-4" />
            <span className="text-sm font-medium">Yeni Sohbet</span>
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between p-4 md:p-10">
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center text-orange-400 drop-shadow-lg">
            AI-Writer
          </h1>
          <div className="space-y-4 mb-6 overflow-y-auto max-h-[50vh] md:max-h-[70vh] custom-scrollbar">
            {currentChatHistory.map((item, index) => (
              <div key={index} className="p-4 rounded-lg mb-4 shadow-lg">
                <div className="bg-gray-800 p-4 rounded-lg mb-2">
                  <h2 className="text-lg font-bold text-orange-400">Siz:</h2>
                  <p className="mt-2">{item.input}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-lg font-bold text-orange-400">
                    Yapay Zeka:
                  </h2>
                  <p className="mt-2">{item.response}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full bg-gradient-to-r from-gray-700 to-gray-800 p-5 rounded-xl shadow-lg fixed bottom-4 left-4 right-4 md:static"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-grow p-4 border border-orange-400 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-900 text-white placeholder-gray-400"
              placeholder="Sorunuzu yazın..."
              disabled={isLoading || isSearchDisabled}
            />
            <button
              type="submit"
              className={`py-3 px-8 rounded-full text-white font-semibold shadow-lg transition-transform duration-300 transform ${
                isLoading || isSearchDisabled
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 hover:scale-105"
              }`}
              disabled={isLoading || isSearchDisabled}
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

        @media (max-width: 768px) {
          .flex-grow {
            padding: 10px;
          }
        }

        @media (max-width: 480px) {
          .fixed {
            padding: 5px;
            bottom: 16px;
            left: 16px;
            right: 16px;
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
