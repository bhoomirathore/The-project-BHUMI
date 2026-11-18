import React, { useState, useEffect, memo } from 'react';

const LiveClock = memo(function LiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="rounded-md border bg-muted px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-foreground">
      {time}
    </span>
  );
});

export default LiveClock;
