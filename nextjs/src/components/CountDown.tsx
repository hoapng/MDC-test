import { useEffect, useState } from "react";

const CountDown = (props: any) => {
  const { timing, count, setCount } = props;
  useEffect(() => {
    if (timing) {
      const timer = setInterval(() => {
        setCount(count + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [count, timing, setCount]);
  //convert seconds to HH:MM:SS
  const toHHMMSS = (secs: any) => {
    const sec_num = parseInt(secs, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };
  return (
    <>
      <div className="countdown-container m-auto">{toHHMMSS(count)}</div>
    </>
  );
};

export default CountDown;
