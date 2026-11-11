import { useCallback, useEffect, useRef, useState } from "react";

export function useCooldown(seconds = 60) {
  const [left, setLeft] = useState(0);
  const timer = useRef(null);

  const clear = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const start = useCallback(() => {
    setLeft(seconds);
    clear();
    timer.current = window.setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          clear();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }, [seconds]);

  useEffect(() => clear, []);

  return { left, start, active: left > 0 };
}
