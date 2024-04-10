import React, { useState, useEffect } from "react";

const IdleTimer = ({ timeout, onIdle }) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let idleTimer;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (!idle) {
        setIdle(true);
        onIdle(); // Trigger any action when the user becomes idle
      }
      idleTimer = setTimeout(() => {
        setIdle(false);
      }, timeout);
    };

    const handleUserActivity = () => {
      resetIdleTimer();
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Initial setup of the idle timer
    resetIdleTimer();

    // Cleanup event listeners on component unmount
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [timeout, onIdle, idle]);

  return <>{/* Your application content */}</>;
};

export default IdleTimer;
