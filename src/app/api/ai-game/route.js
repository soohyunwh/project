import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function GET() {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "너는 404 페이지에서 실행할 수 있는 간단한 미니게임을 JSON 형식으로 생성하는 AI야." },
                { role: "user", content: "반드시 JSON 형식으로만 응답해야 해. 예제: { \"title\": \"게임 제목\", \"rules\": \"게임 규칙\" }" }
            ],
            temperature: 0.7,
            max_tokens: 150
        });

        const gameData = response.choices[0]?.message?.content?.trim();
        console.log("🔍 OpenAI 응답:", gameData);

        let game;
        try {
            game = JSON.parse(gameData);
        } catch (error) {
            console.error("JSON 변환 실패:", error);
            game = { title: "게임 생성 실패", rules: "AI 응답을 올바른 JSON 형식으로 변환할 수 없습니다." };
        }

        return NextResponse.json({ game });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "게임 생성에 실패했습니다." }, { status: 500 });
    }
}
