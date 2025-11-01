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
