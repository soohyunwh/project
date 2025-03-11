import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req) {
    try {
        console.log("환경 변수 체크:", process.env.OPENAI_API_KEY);  

        if (!process.env.OPENAI_API_KEY) {
            throw new Error("환경 변수 `OPENAI_API_KEY`가 설정되지 않았습니다.");
        
        }

        const { question } = await req.json(); // 사용자 입력 받기
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // 환경 변수에서 API 키 가져오기
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "너는 404 페이지에서 랜덤하고 재밌는 답변을 제공하는 챗봇이야." },
                { role: "user", content: question }
            ],
        });

        return NextResponse.json({ answer: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "AI 응답을 가져오는 데 실패했습니다." }, { status: 500 });
    }
}
