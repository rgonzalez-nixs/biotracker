import {
  AppShell,
  Box,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'

const tiles = [
  {
    title: 'API server (NestJS)',
    description: 'Default HTTP API ready for modules, controllers, and guards.',
    docs: 'https://docs.nestjs.com/',
    port: 3000,
  },
  {
    title: 'MCP server (NestJS)',
    description:
      'A dedicated Nest service to wire up Model Context Protocol handlers.',
    docs: 'https://modelcontextprotocol.io/',
    port: 3030,
  },
  {
    title: 'Web app (React + Mantine)',
    description:
      'Client starter built with Vite, Mantine components, and TypeScript.',
    docs: 'https://mantine.dev/',
    port: 5173,
  },
]

function App() {
  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Stack gap={2}>
              <Title order={3}>Biotracker</Title>
              <Text size="sm" c="dimmed">
                Monorepo starter with NestJS, Mantine, and MCP service
              </Text>
            </Stack>
            <Group gap="xs">
              <Button
                component="a"
                href="https://nestjs.com/"
                target="_blank"
                variant="light"
                color="gray"
              >
                NestJS
              </Button>
              <Button
                component="a"
                href="https://mantine.dev/"
                target="_blank"
                variant="filled"
              >
                Mantine
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2}>Ready to build</Title>
              <Text c="dimmed">
                Install dependencies, run each workspace, and start shipping.
              </Text>
            </Stack>

            <Stack gap="sm">
              {tiles.map((tile) => (
                <Card withBorder radius="md" key={tile.title} padding="lg">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={6}>
                      <Title order={4}>{tile.title}</Title>
                      <Text c="dimmed" size="sm">
                        {tile.description}
                      </Text>
                      <Group gap="xs">
                        <Button
                          component="a"
                          href={tile.docs}
                          target="_blank"
                          variant="subtle"
                          size="sm"
                        >
                          Docs
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          component="a"
                          href={`http://localhost:${tile.port}`}
                        >
                          Open localhost:{tile.port}
                        </Button>
                      </Group>
                    </Stack>
                    <Box
                      p="xs"
                      px="sm"
                      bg="var(--mantine-color-blue-light)"
                      c="var(--mantine-color-blue-9)"
                      fw={600}
                      style={{ borderRadius: 8 }}
                    >
                      Port {tile.port}
                    </Box>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
