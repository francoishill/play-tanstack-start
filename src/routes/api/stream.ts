import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { StreamMessage } from "~/types/dtos";

const inputSchema = z.object({
  numMessages: z.number().min(1).max(100).default(5),
});

export const Route = createFileRoute("/api/stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const { numMessages } = inputSchema.parse(body);

        const startTime = new Date();

        // Create a ReadableStream for streaming responses
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();

            // Helper to send a message with explicit flushing
            const sendMessage = (message: StreamMessage) => {
              const jsonLine = JSON.stringify(message) + "\n";
              controller.enqueue(encoder.encode(jsonLine));
            };

            // Send start message
            sendMessage({
              type: "start",
              startTime: startTime.toISOString(),
            });

            try {
              // Simulate multiple messages with delays
              for (let i = 1; i <= numMessages; i++) {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                sendMessage({
                  type: "progress",
                  message: `Message ${i}...`,
                  percentage: (i / numMessages) * 100,
                });
              }
            } catch (error) {
              console.error("Error occurred:", error);
              sendMessage({
                type: "complete",
              });
            }

            // Close the stream
            controller.close();
          },
        });

        // Return streaming response with proper headers
        return new Response(stream, {
          status: 200,
          headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no", // Disable nginx buffering
          },
        });
      },
    },
  },
});
