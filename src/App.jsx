import React, { useState } from "react";
import "./App.css";

const ZONES = [
  { id: "left", label: "왼쪽", x: "18%" },
  { id: "center", label: "가운데", x: "50%" },
  { id: "right", label: "오른쪽", x: "82%" },
];

export default function App() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const [phase, setPhase] = useState("keeper");
  const [keeperChoice, setKeeperChoice] = useState(null);
  const [keeperZone, setKeeperZone] = useState(null);
  const [shotZone, setShotZone] = useState(null);
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [isShooting, setIsShooting] = useState(false);

  const maxRound = 4;
  const isFinished = round >= maxRound;

  function chooseKeeper(zone) {
    if (isFinished || phase !== "keeper") return;

    setKeeperChoice(zone);
    setKeeperZone(null);
    setShotZone(null);
    setResult(null);
    setPhase("kicker");
  }

  function shoot(zone) {
    if (isFinished || phase !== "kicker" || isShooting || !keeperChoice) return;

    const isGoal = zone.id !== keeperChoice.id;

    setShotZone(zone);
    setKeeperZone(keeperChoice);
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
          keeper: keeperChoice.label,
          result: isGoal ? "GOAL" : "SAVE",
        },
      ]);

      setIsShooting(false);

      if (round + 1 >= maxRound) {
        setPhase("finished");
      } else {
        setPhase("result");
      }
    }, 760);
  }

  function nextRound() {
    setKeeperChoice(null);
    setKeeperZone(null);
    setShotZone(null);
    setResult(null);
    setPhase("keeper");
  }

  function resetGame() {
    setRound(0);
    setScore(0);
    setPhase("keeper");
    setKeeperChoice(null);
    setKeeperZone(null);
    setShotZone(null);
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
            <span>2 PLAYER PENALTY SHOOTOUT</span>
          </div>

          <div className="field">
            <div className="crowd crowd-one" />
            <div className="crowd crowd-two" />

            <div className="goal-frame">
              <div className="net-lines" />
            </div>

            <div className="keeper-start">GK</div>

            <div
              className={`keeper ${
                keeperZone ? `keeper-${keeperZone.id}` : ""
              } ${isShooting ? "keeper-dive" : ""}`}
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

          <div className="phase-box">
            {phase === "keeper" && (
              <p>
                <b>플레이어 1</b> 골키퍼 방향을 선택하세요.
              </p>
            )}

            {phase === "kicker" && (
              <p>
                골키퍼 선택 완료! <b>플레이어 2</b>가 슛 방향을 선택하세요.
              </p>
            )}

            {phase === "result" && (
              <p>
                결과 확인 완료! 다음 라운드로 넘어가세요.
              </p>
            )}

            {phase === "finished" && (
              <p>
                경기 종료! 최종 득점은 <b>{score}/{maxRound}</b>입니다.
              </p>
            )}
          </div>

          {phase === "keeper" && (
            <div className="controls">
              {ZONES.map((zone) => (
                <button key={zone.id} onClick={() => chooseKeeper(zone)}>
                  {zone.label}
                </button>
              ))}
            </div>
          )}

          {phase === "kicker" && (
            <div className="controls">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => shoot(zone)}
                  disabled={isShooting}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          )}

          {phase === "result" && (
            <div className="controls one">
              <button onClick={nextRound}>다음 라운드</button>
            </div>
          )}

          {phase === "finished" && (
            <div className="controls one">
              <button onClick={resetGame}>처음부터 다시 하기</button>
            </div>
          )}
        </div>

        <aside className="side-panel">
          <div className="mini-status side">
            <div>
              <span>득점</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>라운드</span>
              <strong>
                {round}/{maxRound}
              </strong>
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
                    <small>
                      슛 {item.shot} · 키퍼 {item.keeper}
                    </small>
                  </div>
                  <strong
                    className={
                      item.result === "GOAL" ? "goal-text" : "save-text"
                    }
                  >
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
