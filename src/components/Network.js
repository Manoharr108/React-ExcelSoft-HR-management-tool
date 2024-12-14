import React, { useState, useEffect } from "react";

const NoNetworkBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div style={styles.banner}>
      <p style={styles.text}>You are offline. Please check your Internet connection.</p>
    </div>
  );
};

const styles = {
  banner: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ff4c4c",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
    zIndex: 1000,
  },
  text: {
    margin: 0,
    fontWeight: "bold",
  },
};

export default NoNetworkBanner;
