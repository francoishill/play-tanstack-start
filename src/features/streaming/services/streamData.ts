import { ReceivedMessage, StreamMessage } from "~/types/dtos";
import logDebug from "~/utils/logDebug";

interface Args {
  numMessages: number;
  setStatusMessage: (status: string | null) => void;
  setPercentage: (percentage: number) => void;
  setMetadata: (
    metadata: {
      startTime: string;
      endTime: string;
      totalDurationMs: number;
    } | null
  ) => void;
  addReceivedMessage: (message: ReceivedMessage) => void;
}

export async function streamData(args: Args) {
  const {
    numMessages,
    setStatusMessage,
    setPercentage,
    setMetadata,
    addReceivedMessage,
  } = args;

  let startTime: string | null = null;

  try {
    const response = await fetch("/api/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      let lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const msg: StreamMessage = JSON.parse(line);
            logDebug("Received message:", msg);

            if (msg.type === "start") {
              startTime = msg.startTime;
              setStatusMessage("Streamining...");
              addReceivedMessage({
                id: `start-${Date.now()}`,
                message: "Stream started",
                timestamp: new Date(),
                type: "start",
              });
            } else if (msg.type === "progress") {
              setStatusMessage(msg.message);
              if (msg.percentage !== undefined) {
                setPercentage(msg.percentage);
              }
              addReceivedMessage({
                id: `progress-${Date.now()}-${Math.random()}`,
                message: msg.message,
                timestamp: new Date(),
                type: "progress",
                percentage: msg.percentage,
              });
            } else if (msg.type === "complete") {
              const endTime = new Date();
              if (startTime) {
                setMetadata({
                  startTime,
                  endTime: endTime.toISOString(),
                  totalDurationMs:
                    endTime.getTime() - new Date(startTime).getTime(),
                });
              }
              setStatusMessage("Stream complete!");
              addReceivedMessage({
                id: `complete-${Date.now()}`,
                message: "Stream completed",
                timestamp: new Date(),
                type: "complete",
              });
              break;
            }
          } catch (parseError) {
            console.error("Failed to parse JSON line:", line, parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error("Stream error:", error);
    setStatusMessage(
      error instanceof Error ? error.message : "Failed to Stream repositories"
    );
    throw error;
  }

  logDebug("Stream complete!");
}
