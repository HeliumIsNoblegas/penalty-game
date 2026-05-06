import React, { useState } from "react";
import "./App.css";

const ZONES = [
  { id: "left", label: "왼쪽", x: "18%" },
  { id: "center", label: "가운데", x: "50%" },
  { id: "right", label: "오른쪽", x: "82%" },
];

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function App() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [shotZone, setShotZone] = useState(null);
  const [keeperZone, setKeeperZone] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isShooting, setIsShooting] = useState(false);

  const maxRound = 5;
  const isFinished = round >= maxRound;

  let title = "도전 중";
  if (isFinished) {
    if (score === 5) title = "월드컵 영웅";
    else if (score >= 4) title = "승부차기 장인";
    else if (score >= 3) title = "국대 후보";
    else if (score >= 2) title = "동네 메시";
    else title = "연습이 필요한 선수";
  }

  function shoot(zone) {
    if (isFinished || isShooting) return;

    const keeper = pickRandom(ZONES);
    const isGoal = zone.id !== keeper.id;

    setShotZone(zone);
    setKeeperZone(keeper);
    setResult(null);
    setIsShooting(true);

    setTimeout(() => {
      setResult(isGoal ? "goal" : "save");

      setScore((prev) => prev + (isGoal ? 1 : 0));
      setRound((prev) => prev + 1);

      setHistory((prev) => [
        ...prev,
        {
        round: prev.length + 1,
        shot: zone.label,
        keeper: keeper.label,
        result: isGoal ? "GOAL" : "SAVE",
        },
      ]);

      setTimeout(() => {
        setIsShooting(false);
      }, 450);
    }, 760);
  }

  function resetGame() {
  setRound(0);
  setScore(0);
  setShotZone(null);
  setKeeperZone(null);
  setResult(null);
  setHistory([]);
  setIsShooting(false);
  }

  return (
    <main className="page">
      <section className="game-layout">
        <div className="stadium-card">
          <div className="stadium-top">
            <span className="live-dot" />
            <span>LIVE PENALTY SHOOTOUT</span>
          </div>

          <div className="field">
            <div className="crowd crowd-one" />
            <div className="crowd crowd-two" />

            <div className="goal-frame">
              <div className="net-lines" />
            </div>

            <div className="keeper-start">GK</div>
            <div
              className={`keeper ${keeperZone ? `keeper-${keeperZone.id}` : ""} ${isShooting ? "keeper-dive" : ""}`}
            >
              🧤
            </div>

            <div className="penalty-arc" />
            <div className="spot" />

            <div
              className={`ball ${isShooting ? "ball-shooting" : ""}`}
              style={{
                "--target-x": shotZone ? shotZone.x : "50%",
              }}
            >
              <img src="/soccer-ball.png" alt="축구공" className="ball-img" />
            </div>

            {result && (
              <div className={`result-pop ${result}`}>
                {result === "goal" ? "GOAL!" : "SAVE!"}
              </div>
            )}
          </div>

          <div className="controls">
            {ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => shoot(zone)}
                disabled={isFinished || isShooting}
              >
                {zone.label}으로 슛
              </button>
            ))}
          </div>
        </div>

        <aside className="side-panel">
          <div className="mini-status side">
            <div>
              <span>득점</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>라운드</span>
              <strong>{round}/{maxRound}</strong>
            </div>
          </div>

          <div className="history">
            <div className="history-title">
              <h3>슈팅 기록</h3>
              <span>{history.length}회</span>
            </div>
            {history.length === 0 ? (
              <p className="empty">아직 기록이 없습니다.</p>
            ) : (
              history.map((item) => (
                <div className="history-item" key={item.round}>
                  <div>
                    <b>{item.round}차 시도</b>
                    <small>슛 {item.shot} · 키퍼 {item.keeper}</small>
                  </div>
                  <strong className={item.result === "GOAL" ? "goal-text" : "save-text"}>
                    {item.result}
                  </strong>
                </div>
              ))
            )}
          </div>

          <button className="reset outside" onClick={resetGame}>
            다시 도전하기
          </button>
        </aside>
      </section>
    </main>
  );
}