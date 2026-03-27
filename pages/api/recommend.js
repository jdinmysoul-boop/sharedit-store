import OpenAI from "openai";
import productsData from '../../data/products.json';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { query } = req.body;

  try {
    // 1. 데이터 다이어트
    const shortList = productsData.slice(0, 10).map(p => ({
      id: p.id, name: p.name, headline: p.headline
    }));

    // 2. GPT-4o-mini 호출 (매우 빠름)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that recommends products in JSON format. Respond only in JSON." },
        { role: "user", content: `Query: ${query}\nProducts: ${JSON.stringify(shortList)}\nFormat: {"recommendedIds": [], "reason": ""}` }
      ],
      response_format: { type: "json_object" }, // JSON 출력 강제
      max_tokens: 300,
    });

    res.status(200).json(JSON.parse(completion.choices[0].message.content));

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "분석 실패" });
  }
}