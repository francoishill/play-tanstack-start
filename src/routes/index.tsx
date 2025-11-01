import { Container, Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import ExampleStreamServerData from "~/features/streaming/ExampleStreamServerData";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>Play Tanstack Start</Title>

        <ExampleStreamServerData />
      </Stack>
    </Container>
  );
}
