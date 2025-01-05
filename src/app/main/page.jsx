"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (err) {
      console.error("Hata detayı:", err);
      setError(`Hata: ${err.message}`);
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">OpenAI Chatbot</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="5"
          cols="50"
          className="w-full p-2 border rounded"
          placeholder="Sorunuzu yazın..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`${
            isLoading ? "bg-gray-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
          disabled={isLoading}
        >
          {isLoading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Cevap:</h2>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
}
