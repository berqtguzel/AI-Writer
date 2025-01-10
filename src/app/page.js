"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center p-10">
      <h1 className="text-5xl font-extrabold mb-6 text-center text-orange-400 drop-shadow-lg">
        AI-Writer'e Hoşgeldiniz
      </h1>
      <p className="text-center text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
        AI-Writer, yapay zeka teknolojisi kullanarak sosyal medya içerikleri, blog özetleri ve daha fazlasını yazmanıza yardımcı olan bir uygulamadır. Bu uygulama, yapay zeka ile içerik üretimini kolaylaştırır ve zaman kazandırır. AI-Writer ile sosyal medya gönderileri, blog yazıları, ürün açıklamaları ve daha birçok içerik türünü hızlı ve etkili bir şekilde oluşturabilirsiniz. Yapay zeka teknolojisi sayesinde, içerikleriniz her zaman özgün ve kaliteli olacaktır.
      </p>
      <Link
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        href="/login"
      >
        Giriş Yap
      </Link>
    </div>
  );
}