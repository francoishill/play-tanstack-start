import {
  Button,
  NumberInput,
  Paper,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { streamData } from "~/features/streaming/services/streamData";

export default function ExampleStreamServerData() {
  const [numMessages, setNumMessages] = useState(3);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(0);

  const [metadata, setMetadata] = useState<{
    startTime: string;
    endTime: string;
    totalDurationMs: number;
  } | null>(null);

  const scanMutation = useMutation({
    mutationFn: streamData,
    onSuccess: () => {
      notifications.show({
        title: "Streaming complete",
        message: "The streaming of messages has completed successfully.",
        color: "green",
      });
    },
  });

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <NumberInput
          label="Number of messages"
          value={numMessages}
          onChange={(val) => {
            if (
              val == null ||
              (typeof val === "string" && val.trim().length === 0)
            ) {
              setNumMessages(0);
              return;
            }

            const numVal = typeof val === "number" ? val : parseInt(val, 10);
            setNumMessages(numVal);
          }}
          min={1}
          max={100}
        />

        <Button
          onClick={() =>
            scanMutation.mutate({
              numMessages,
              setStatusMessage,
              setPercentage,
              setMetadata,
            })
          }
          disabled={scanMutation.isPending}
          size="md"
          loading={scanMutation.isPending}
        >
          {scanMutation.isPending ? "Streaming..." : "Start stream"}
        </Button>

        {/* Progress indicator */}
        {scanMutation.isPending && (
          <Stack gap="sm">
            <Text size="sm" c="dimmed">
              {statusMessage}
            </Text>

            {percentage > 0 && (
              <>
                <div>
                  {metadata && (
                    <>
                      <Text size="xs" c="dimmed">
                        {`Total Duration: ${(
                          metadata.totalDurationMs / 1000
                        ).toFixed(1)}s`}
                      </Text>

                      <Text size="xs" c="dimmed">
                        {`Elapsed: ${(
                          (new Date().getTime() -
                            new Date(metadata.startTime).getTime()) /
                          1000
                        ).toFixed(1)}s`}
                      </Text>

                      <Text size="xs" c="dimmed">
                        {`Finished at: ${new Date(
                          metadata.endTime
                        ).toLocaleTimeString()}`}
                      </Text>
                    </>
                  )}
                </div>

                <Progress value={percentage} animated />
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
