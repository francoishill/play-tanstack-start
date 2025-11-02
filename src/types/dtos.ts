export type StreamMessage =
  | {
      type: "progress";
      message: string;
      percentage?: number;
    }
  | {
      type: "complete";
    }
  | {
      type: "start";
      startTime: string;
    };

export interface ReceivedMessage {
  id: string;
  message: string;
  timestamp: Date;
  type: StreamMessage["type"];
  percentage?: number;
}
