import React, { useState, useEffect } from "react";
import "./styles.scss";

const CRITICAL_TIME = 20;
const ONE_MINUTE = 60;
const getFixed = val => (val / 100).toFixed(2).split(".")[1];

const Ticker = ({ value, started, onTimeUp }) => {
  const [amount, setAmount] = useState(value);
  const [paused, setPaused] = useState(true);
  const [interval, setInterval] = useState(1);

  const handleInterval = e => {
    setInterval(Number(e.target.getAttribute("data-key")));
  };

  useEffect(() => {
    if (started === 1) {
      setPaused(false);
      setAmount(value ? value * ONE_MINUTE : 0);
    }
  }, [started, value]);

  useEffect(() => {
    if (!paused) {
      setTimeout(() => {
        if (amount < 1) {
          setPaused(true);
          setAmount(0);
          onTimeUp();
        } else {
          setAmount(amount - 1);
        }
      }, (1 / interval) * 1000);
    }
  }, [interval, amount, paused, onTimeUp]);

  const getTip = () => {
    if (!started) return null;
    let tip = "";
    if (amount <= (value * ONE_MINUTE) / 2) tip = "More than halfway there";
    if (amount <= 0) tip = "Time's up!";
    return <p className={`tip ${amount > 0 ? "valuable" : "end"}`}>{tip}</p>;
  };
  const getStatus = () => {
    if (!started) return "";
    const status = [];
    if (amount <= CRITICAL_TIME) status.push("red");
    if (amount <= CRITICAL_TIME / 2) status.push("blink");
    return status.join(" ");
  };
  const getTime = input => {
    const time = input || amount;
    const seconds = time % 60;
    const minutes = (time - seconds) / 60;
    return `${getFixed(minutes)}:${getFixed(seconds)}`;
  };
  const isActive = val => (interval === val ? "active" : "");

  return (
    <div className="ticker">
      {getTip()}
      {amount > 0 && (
        <>
          <div className="ticker__time">
            <span
              className={getStatus()}
              style={{ animationDuration: `${1 / interval}s` }}
            >
              {getTime()}
            </span>
            <button className="control" onClick={() => setPaused(!paused)}>
              <div className={`button ${paused ? "paused" : ""}`} />
            </button>
          </div>
          <div className="ticker__interval">
            <button
              data-key="1"
              className={isActive(1)}
              onClick={handleInterval}
            >
              1X
            </button>
            <button
              data-key="1.5"
              className={isActive(1.5)}
              onClick={handleInterval}
            >
              1.5X
            </button>
            <button
              data-key="2"
              className={isActive(2)}
              onClick={handleInterval}
            >
              2X
            </button>
          </div>
        </>
      )}
      {!!started && amount === 0 && (
        <div className="ticker__time">
          <span className="red">{getTime(value * ONE_MINUTE)}</span>
          <button
            className="control"
            onClick={() => {
              setPaused(false);
              setAmount(value ? value * ONE_MINUTE : 0);
            }}
          >
            <div className="button" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [time, setTime] = useState("");
  const [started, setStarted] = useState(0);

  const handleCounter = e => {
    e.preventDefault();
    setStarted(1);
  };

  return (
    <div className="App">
      <h1>DCS_TASK_1: Countdown (React)</h1>
      <h2>React application with controls to</h2>
      <ul>
        <li>add time</li>
        <li>speed up / slow down</li>
        <li>pause, and resum</li>
      </ul>
      <form onSubmit={handleCounter}>
        <label>Countdown:</label>
        <input
          value={time}
          onChange={e => setTime(e.target.value)}
          placeholder="(Min)"
          type="number"
          min={1}
          required
          disabled={started === 1}
        />
        <input type="submit" value="Start" disabled={started === 1} />
      </form>
      <Ticker value={time} onTimeUp={() => setStarted(2)} started={started} />
    </div>
  );
}
