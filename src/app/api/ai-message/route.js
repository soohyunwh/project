import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function GET() {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: "이 404 페이지가 존재하지 않는 랜덤한 이유를 하나 만들어줘." }]
        });

        return NextResponse.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "AI 응답을 가져오는 데 실패했습니다." }, { status: 500 });
    }
}
