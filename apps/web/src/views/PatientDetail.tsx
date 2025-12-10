import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Loader,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  Title,
  Divider,
  Paper,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  CategoryScale,
  Chart as ChartJS,
  Title as ChartTitle,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate, useParams } from 'react-router-dom';
import { getAiInsights, getBiotrackers, getPatient } from '../services/api';
import Markdown from 'react-markdown';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const patient = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatient(Number(id!)),
  });
  const biotrackers = useQuery({
    queryKey: ['biotrackers', id],
    queryFn: () => getBiotrackers(Number(id)),
    refetchInterval: liveUpdates ? 1000 : false,
  });
  const aiInsights = useQuery({
    queryKey: ['aiInsights', id],
    queryFn: () => getAiInsights(Number(id!), patient.data?.name ?? '', biotrackers.data ?? []),
    enabled: false,
  });

  const loading = patient.isPending || biotrackers.isPending;

  const categories = useMemo(
    () => Array
      .from(new Set((biotrackers.data ?? []).map((b) => b.category)))
      .map((c) => ({ label: c[0].toUpperCase() + c.slice(1), value: c }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [biotrackers]
  );

  const analysisContent = aiInsights.data?.analysis
    ? aiInsights.data.analysis.text
    : null;
  const suggestionsContent = aiInsights.data?.suggestions
    ? aiInsights.data.suggestions.text
    : null;

  const handleGetAIInsights = () => {
    aiInsights.refetch();
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading patient data...</Text>
        </Stack>
      </Container>
    );
  }

  if (patient.error || !patient.data) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error">
          {patient.error?.message || 'Patient not found'}
        </Alert>
        <Button mt="md" onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </Container>
    );
  }

  // Prepare chart data
  const chartData = !biotrackers.data
    ? { labels: [], datasets: [] }
    : {
      labels: biotrackers.data.map((b) => b.name),
      datasets: [
        {
          label: 'Value',
          data: biotrackers.data.map((b) => b.value),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Reference Min',
          data: biotrackers.data.map((b) => b.referenceRange.min),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          tension: 0.1,
        },
        {
          label: 'Reference Max',
          data: biotrackers.data.map((b) => b.referenceRange.max),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          tension: 0.1,
        },
      ],
    };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biotrackers Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'green';
      case 'high':
        return 'red';
      case 'low':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>{patient.data.name}</Title>
            <Text c="dimmed">Patient ID: {patient.data.id}</Text>
          </Stack>
          <Button variant="light" onClick={() => navigate('/patients')}>
            Back to Patients
          </Button>
        </Group>

        {/* Patient Details */}
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Title order={4}>Patient Details</Title>
            <Group gap="xl">
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Date of Birth
                </Text>
                <Text fw={500}>{patient.data.dateOfBirth}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Last Visit
                </Text>
                <Text fw={500}>{patient.data.lastVisit}</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>

        {/* Controls */}
        <Card withBorder radius="md" padding="lg">
          <Group justify="space-between">
            <Switch
              label="Live Updates"
              checked={liveUpdates}
              onChange={(e) => setLiveUpdates(e.currentTarget.checked)}
            />
            <Button
              onClick={handleGetAIInsights}
              loading={aiInsights.isFetching}
            >
              Get AI Insights
            </Button>
          </Group>
        </Card>

        {/* AI Insights */}
        {(aiInsights.data || aiInsights.isFetching || aiInsights.error) && (
          <Card withBorder radius="md" padding="lg">
            <Stack gap="md">
              <Title order={4}>AI Insights</Title>
              {aiInsights.isFetching ? (
                <Group justify="center" p="xl">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Generating insights...</Text>
                </Group>
              ) : aiInsights.error ? (
                <Alert color="red" title="Error">
                  {aiInsights.error instanceof Error
                    ? aiInsights.error.message
                    : 'Failed to load AI insights'}
                </Alert>
              ) : aiInsights.data && aiInsights.data.analysis && aiInsights.data.suggestions ? (
                <Stack gap="lg">
                  <Paper p="md" withBorder radius="sm">
                    <Stack gap="sm">
                      {analysisContent && (
                        <>
                          <Title order={5}>Analysis</Title>
                          <Markdown >
                            {typeof analysisContent === 'string'
                              ? analysisContent
                              : JSON.stringify(analysisContent, null, 2)}
                          </Markdown>
                        </>
                      )}
                      {suggestionsContent && (
                        <>
                          {analysisContent && <Divider />}
                          <Title order={5}>Suggestions</Title>
                          <Markdown >
                            {typeof suggestionsContent === 'string'
                              ? suggestionsContent
                              : JSON.stringify(suggestionsContent, null, 2)}
                          </Markdown>
                        </>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  No insights available. Click "Get AI Insights" to generate insights.
                </Text>
              )}
            </Stack>
          </Card>
        )}

        {/* Biotrackers Table */}
        {biotrackers.data && <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Flex>
              <Title order={4} flex={1}>Biotrackers</Title>
              <Select
                data={[
                  { label: 'All', value: '' },
                  ...categories
                ]} value={selectedCategory} onChange={(value) => setSelectedCategory(categories.find((c) => c.value === value)?.value ?? '')} />
            </Flex>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Value</Table.Th>
                  <Table.Th>Unit</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Reference Range</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Measured At</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {biotrackers.data.filter((b) => selectedCategory == '' || b.category === selectedCategory).map((biotracker) => (
                  <Table.Tr key={biotracker.id}>
                    <Table.Td>{biotracker.name}</Table.Td>
                    <Table.Td>{biotracker.value}</Table.Td>
                    <Table.Td>{biotracker.unit}</Table.Td>
                    <Table.Td>{biotracker.category}</Table.Td>
                    <Table.Td>
                      {biotracker.referenceRange.min} - {biotracker.referenceRange.max}
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(biotracker.status)}>
                        {biotracker.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {new Date(biotracker.measuredAt).toLocaleDateString()}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>}

        {/* Biotrackers Graph */}
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Title order={4}>Biotrackers Graph</Title>
            <div style={{ height: '400px', position: 'relative', width: '100%' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
