import { useKeyboardControls } from "@react-three/drei";
import UseGame from "./stores/UseGame";
import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";

const Interface = () => {

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  const restart = UseGame((state) => state.restart);
  const phase = UseGame((state) => state.phase);

  const time = useRef()

  useEffect(() => {
    const unsubcribeEffect = addEffect(() => {
      const state = UseGame.getState()
      let elapsedTime = 0

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime
      }

      elapsedTime /= 1000
      elapsedTime = elapsedTime.toFixed(2)

      if(time.current) {
        time.current.textContent = elapsedTime
      }
    })
    return () => {
      unsubcribeEffect()
    }
  }, []);


  return (
    <div className="interface">
      {/* TIMER */}
      <div ref={time} className="timer">0.00</div>
      {/* RESTART */}
      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}
      {/* Controls */}

      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}>↑</div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}>←</div>
          <div className={`key ${backward ? "active" : ""}`}>↓</div>
          <div className={`key ${rightward ? "active" : ""}`}>→</div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}>↑</div>
        </div>
      </div>
    </div>
  );
}
 
export default Interface;