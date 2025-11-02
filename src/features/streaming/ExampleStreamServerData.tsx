import {
  Badge,
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { streamData } from "~/features/streaming/services/streamData";
import { ReceivedMessage } from "~/types/dtos";

export default function ExampleStreamServerData() {
  const [numMessages, setNumMessages] = useState(3);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>(
    []
  );

  const [metadata, setMetadata] = useState<{
    startTime: string;
    endTime: string;
    totalDurationMs: number;
  } | null>(null);

  const scanMutation = useMutation({
    mutationFn: streamData,
    onMutate: () => {
      // Clear previous messages when starting a new stream
      setReceivedMessages([]);
      setPercentage(0);
      setMetadata(null);
    },
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
              addReceivedMessage: (message: ReceivedMessage) => {
                setReceivedMessages((prev) => [message, ...prev]);
              },
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

        {/* Messages Container */}
        {receivedMessages.length > 0 && (
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Group justify="space-between" align="center">
                <Text size="sm" fw={500}>
                  Received Messages ({receivedMessages.length})
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  color="gray"
                  onClick={() => setReceivedMessages([])}
                >
                  Clear
                </Button>
              </Group>

              <Divider />

              <ScrollArea h={400}>
                <Stack gap="xs">
                  {receivedMessages.map((message) => (
                    <Paper
                      key={message.id}
                      p="xs"
                      withBorder
                      radius="sm"
                      bg="gray.0"
                    >
                      <Group justify="space-between" align="flex-start">
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Badge
                              size="xs"
                              color={
                                message.type === "start"
                                  ? "blue"
                                  : message.type === "progress"
                                  ? "yellow"
                                  : "green"
                              }
                            >
                              {message.type}
                            </Badge>
                            {message.percentage !== undefined && (
                              <Badge size="xs" color="gray">
                                {message.percentage.toFixed(1)}%
                              </Badge>
                            )}
                          </Group>
                          <Text size="sm">{message.message}</Text>
                        </Stack>
                        <Text
                          size="xs"
                          c="dimmed"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
