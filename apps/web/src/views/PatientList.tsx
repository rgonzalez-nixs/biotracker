import {
  Alert,
  Card,
  Container,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../services/api';

export function PatientList() {
  const navigate = useNavigate();

  const { data: patients =[], isPending, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })

  if (isPending) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading patients...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error">
          {error instanceof Error ? error.message : 'Failed to load patients'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={2}>Patients</Title>

        <Card withBorder radius="md" padding="lg">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date of Birth</Table.Th>
                <Table.Th>Last Visit</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {patients.map((patient) => (
                <Table.Tr
                  key={patient.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <Table.Td>{patient.id}</Table.Td>
                  <Table.Td>{patient.name}</Table.Td>
                  <Table.Td>{patient.dateOfBirth}</Table.Td>
                  <Table.Td>{patient.lastVisit}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    </Container>
  );
}
