import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  AppShell,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Button,
} from '@mantine/core';
import { PatientList } from './views/PatientList';
import { PatientDetail } from './views/PatientDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell header={{ height: 64 }} padding="md">
          <AppShell.Header>
            <Container size="lg" h="100%">
              <Group h="100%" justify="space-between">
                <Stack gap={2}>
                  <Link to="/patients">
                    <Title order={3} style={{ textDecoration: 'none', color: 'inherit' }}>
                      Biotracker
                    </Title>
                  </Link>
                  <Text size="sm" c="dimmed">
                    Patient and biomarker tracking system
                  </Text>
                </Stack>
                <Button
                  component={Link}
                  to="/patients"
                  variant="light"
                >
                  Patients
                </Button>
              </Group>
            </Container>
          </AppShell.Header>

          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Navigate to="/patients" replace />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
