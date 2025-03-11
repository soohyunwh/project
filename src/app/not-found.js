"use client";

import { useState, useEffect } from "react";

export default function NotFound() {
    const [message, setMessage] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [game, setGame] = useState(null);

    useEffect(() => {
        fetch("/api/ai-message")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch(() => setMessage("404 이유를 가져오는 데 실패했습니다."));

        fetch("/api/ai-game")
            .then((res) => res.json())
            .then((data) => {
                console.log("미니게임 API 응답:", data);

                setGame(data.game);
            })
            .catch(() => setGame({ title: "미니게임 불러오기 실패", rules: "다시 시도해주세요." }));
    }, []);

    const handleAskAI = async () => {
        if (!question.trim()) {
            alert("질문을 입력하세요");
            return;
        }

        console.log("AI 질문 버튼 클릭 됨")
        setAnswer("생각 중...");

        try {
            const res = await fetch("/api/ai-chatbot", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({question}),
            });

            console.log("API 응답 받음:", res)

            const data = await res.json();
            setAnswer(data.answer || "응답을 받을 수 없습니다.");

        }catch(error) {
            setAnswer("응답을 가져오는 데 실패했습니다")
            console.error("API 호출 오류:", error)
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAskAI(); 
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - 페이지를 찾을 수 없음</h1>
            <p>{message}</p>

            <h2> 랜덤 미니게임 </h2>
            {game ? (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
                    <h3>{game.title}</h3>
                    <p>{game.rules}</p>
                </div>
            ) : (
                <p> 미니게임을 불러오는 중... </p>
            )}

            <h2> 챗봇 </h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}  
                placeholder="질문을 입력하세요"
                style={{ padding: "8px", width: "70%" }}
            />
            <button onClick={handleAskAI} style={{ marginLeft: "10px", padding: "8px" }}>질문하기</button>

            {answer && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
                    <strong>AI의 답변:</strong>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}
