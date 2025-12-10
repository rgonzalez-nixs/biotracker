import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Card,
  Stack,
  Text,
  Loader,
  Alert,
  Table,
  Button,
  Switch,
  Group,
  Badge,
  Flex,
  Select,
} from '@mantine/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getPatients, getBiomarkers, type Patient, type Biomarker, getPatient } from '../services/api';
import { useQuery } from '@tanstack/react-query';

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
  const biomarkers = useQuery({
    queryKey: ['biomarkers', id],
    queryFn: () => getBiomarkers(Number(id)),
    refetchInterval: liveUpdates ? 1000 : false,
  });

  const loading = patient.isPending || biomarkers.isPending;

  const categories = useMemo(
    () => Array
      .from(new Set((biomarkers.data ?? []).map((b) => b.category)))
      .map((c) => ({ label: c[0].toUpperCase() + c.slice(1), value: c }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [biomarkers]
  );

  const handleGetAIInsights = () => {
    // TODO: Implement AI insights functionality
    alert('AI Insights feature coming soon!');
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
  const chartData = !biomarkers.data
    ? { labels: [], datasets: [] }
    : {
      labels: biomarkers.data.map((b) => b.name),
      datasets: [
        {
          label: 'Value',
          data: biomarkers.data.map((b) => b.value),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Reference Min',
          data: biomarkers.data.map((b) => b.referenceRange.min),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          tension: 0.1,
        },
        {
          label: 'Reference Max',
          data: biomarkers.data.map((b) => b.referenceRange.max),
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
        text: 'Biomarkers Overview',
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
            <Button onClick={handleGetAIInsights}>Get AI Insights</Button>
          </Group>
        </Card>

        {/* Biomarkers Table */}
        {biomarkers.data && <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Flex>
              <Title order={4} flex={1}>Biomarkers</Title>
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
                {biomarkers.data.filter((b) => selectedCategory == '' || b.category === selectedCategory).map((biomarker) => (
                  <Table.Tr key={biomarker.id}>
                    <Table.Td>{biomarker.name}</Table.Td>
                    <Table.Td>{biomarker.value}</Table.Td>
                    <Table.Td>{biomarker.unit}</Table.Td>
                    <Table.Td>{biomarker.category}</Table.Td>
                    <Table.Td>
                      {biomarker.referenceRange.min} - {biomarker.referenceRange.max}
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(biomarker.status)}>
                        {biomarker.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {new Date(biomarker.measuredAt).toLocaleDateString()}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>}

        {/* Biomarkers Graph */}
        <Card withBorder radius="md" padding="lg">
          <Stack gap="md">
            <Title order={4}>Biomarkers Graph</Title>
            <div style={{ height: '400px', position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
