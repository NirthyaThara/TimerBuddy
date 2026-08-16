import { useState, useEffect } from 'react'
import alarmSound from "./assets/amazeAlarm.mp3"
import pixelPet from "./assets/rocky.gif"
import './App.css'

const audio = new Audio(alarmSound);
audio.loop = true;
export default function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsRunning(false);
          audio.play();
          setIsSoundPlaying(true);
          setShowAlarmModal(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  const displayHours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const displayMinutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const displaySeconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="mainView">

      <div className="card">
        <div className="titlebar">
          <span className="titlebar-name">TimerBuddy</span>
          <div className="titlebarButtons">
            <button className="controlButtons minimize" onClick={() => window.electronAPI.minimize()}>
              −
            </button>
            <button className="controlButtons close" onClick={() => window.electronAPI.close()}>
              ✕
            </button>
          </div>
        </div>

        {/* ── Galaxy panel ── */}
        <div className="galaxy-panel">

          {/* subtle vignette overlay */}
          <div className="vignette" />

          {/* time or input */}
          <div className="time-area">
            {isEditing ? (
              <div className="timeInput">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="inputBox"
                  placeholder="00"
                />
                <span className="colon">:</span>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="inputBox"
                  placeholder="00"
                />
                <span className="colon">:</span>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="inputBox"
                  placeholder="00"
                />
                <button
                  className="set-btn"
                  onClick={() => {
                    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
                    setTimeLeft(totalSeconds);
                    setDuration(totalSeconds);
                    setIsRunning(false);
                    setIsEditing(false);
                  }}
                >
                  SET
                </button>
              </div>
            ) : (
              <h2
                className="time"
                title="Click to edit"
                onClick={() => {
                  setIsRunning(false);
                  setIsEditing(true);
                }}
              >
                {displayHours}
                <span className="time-colon">:</span>
                {displayMinutes}
                <span className="time-colon">:</span>
                {displaySeconds}
              </h2>
            )}
          </div>

          {/* progress bar */}
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="buttons">
          <button
            className="btn btn-start"
            onClick={() => timeLeft > 0 && setIsRunning(true)}
          >
            start
          </button>
          <button
            className="btn btn-stop"
            onClick={() => { setIsRunning(false); audio.pause(); }}
          >
            stop
          </button>
          <button
            className="btn btn-reset"
            onClick={() => { setTimeLeft(duration); setIsRunning(false); }}
          >
            reset
          </button>
        </div>
        {
          showAlarmModal && (
            <div className="alarmModal">
              <div className="alarmContent">
                <img className="pixel-pet" src={pixelPet} alt="Pixel pet" />
                <h2 className="alarm-title">Time's Up!</h2>
                <p className="alarm-msg">Amaze Amaze Amaze! Your focus session is complete!</p>
                <div className="alarm-btns">
                  <button
                    className="btn btn-stop zzz"
                    onClick={() => {
                      if (isSoundPlaying) {
                        audio.pause();
                        setIsSoundPlaying(false);
                      } else {
                        audio.play();
                        setIsSoundPlaying(true);
                      }
                    }}
                  >
                    {isSoundPlaying ? "Pause" : "Resume"}
                  </button>
                  <button
                    className="btn btn-start zzz"
                    onClick={() => {
                      audio.pause();
                      audio.currentTime = 0;
                      setIsSoundPlaying(false);
                      setShowAlarmModal(false);
                    }}
                  >
                    Yay!!
                  </button>
                </div>
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
}