import OpenAI from 'openai';

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ 
        message: "API Anahtarı Hatası", 
        error: "OPENAI_API_KEY environment variable'ı bulunamadı" 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const result = response.choices[0].message.content;
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    console.error("API Hatası:", error);
    
    const errorMessage = error.response?.data?.error?.message || error.message;
    return new Response(
      JSON.stringify({ 
        message: "OpenAI API Hatası", 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
