"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedInput = localStorage.getItem("input");
    const savedResponse = localStorage.getItem("response");
    if (savedInput) setInput(savedInput);
    if (savedResponse) setResponse(savedResponse);
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
      localStorage.setItem("input", input);
      localStorage.setItem("response", data.result);
    } catch (err) {
      console.error("Hata detayı:", err);
      setError(`Hata: ${err.message}`);
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">OpenAI Chatbot</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="5"
          cols="50"
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Sorunuzu yazın..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isLoading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
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
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Cevap:</h2>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
}
