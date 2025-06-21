"use client";

import React, { useState, useEffect } from "react";
import socketManager from "@/lib/socket";

const SocketConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Update status every 2 seconds
    const interval = setInterval(() => {
      setConnectionStatus(socketManager.getConnectionStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const testConnection = () => {
    setTestResults([]);
    socketManager.testConnection();
    setTestResults((prev) => [...prev, "Test message sent"]);
  };

  const reconnect = () => {
    setTestResults((prev) => [...prev, "Attempting manual reconnect..."]);
    socketManager.connect();
  };

  const disconnect = () => {
    setTestResults((prev) => [...prev, "Disconnecting..."]);
    socketManager.disconnect();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Socket Connection Test</h3>

      {connectionStatus && (
        <div className="space-y-1 text-xs">
          <div
            className={`flex items-center gap-2 ${
              connectionStatus.connected ? "text-green-600" : "text-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus.connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            Status: {connectionStatus.connected ? "Connected" : "Disconnected"}
          </div>
          <div>Socket ID: {connectionStatus.socketId || "None"}</div>
          <div>
            Reconnect Attempts: {connectionStatus.reconnectAttempts}/
            {connectionStatus.maxAttempts}
          </div>
          <div>Queue Size: {connectionStatus.eventQueueSize}</div>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={testConnection}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test
        </button>
        <button
          onClick={reconnect}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Reconnect
        </button>
        <button
          onClick={disconnect}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="mt-2 text-xs">
          <div className="font-semibold">Test Results:</div>
          {testResults.map((result, index) => (
            <div key={index} className="text-gray-600">
              • {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocketConnectionTest;
