import { useEffect, useState } from "react";
import { getExcavators, deleteExcavator, addLog, addExcavator } from "../api";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Container,
  Title,
  SimpleGrid,
  Text,
  Group,
  Modal,
  TextInput,
  Stack,
  Radio
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function Excavators({ token }) {
  const [excavators, setExcavators] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [logModal, setLogModal] = useState(false);
  const [selectedExcavator, setSelectedExcavator] = useState(null);

  // ✅ Add Excavator Modal State
  const [addModal, setAddModal] = useState(false);
  const [shortname, setShortname] = useState("");
  const [regNumber, setRegNumber] = useState("");

  // form fields for Add Log
  const [attachment, setAttachment] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [diesel, setDiesel] = useState("");

  const navigate = useNavigate();

  // Fetch excavators
  const loadExcavators = () => {
    if (token) {
      getExcavators(token).then((data) => setExcavators(data));
    }
  };

  useEffect(() => {
    loadExcavators();
  }, [token]);

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteExcavator(token, deleteId);
      notifications.show({ message: "Excavator deleted", color: "green" });
      setDeleteId(null);
      loadExcavators();
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

  // Handle Add Log
  const handleAddLog = async () => {
    try {
      await addLog(token, {
        excavatorId: selectedExcavator.id,
        attachment,
        startTime,
        endTime,
        diesel: Number(diesel),
      });
      notifications.show({ message: "Log added successfully", color: "green" });
      setLogModal(false);
      // Clear form
      setAttachment("");
      setStartTime("");
      setEndTime("");
      setDiesel("");
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

  // ✅ Handle Add Excavator
  const handleAddExcavator = async () => {
    try {
      await addExcavator(token, { shortname, regNumber });
      notifications.show({ message: "Excavator added", color: "green" });
      setAddModal(false);
      setShortname("");
      setRegNumber("");
      loadExcavators(); // refresh list
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

  return (
    <Container my="lg" style={{ position: "relative" }}>
      <Title order={2} mb="lg">🚜 Excavators</Title>

<SimpleGrid cols={2} spacing="sm">
  {excavators.map((ex) => (
    <Card
      key={ex.id}
      shadow="xs"
      padding="sm"
      radius="md"
      withBorder
      onClick={() => navigate(`/logs-report?excavatorId=${ex.id}`)}
      style={{ cursor: "pointer", transition: "0.2s ease" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "" }
    >
      <Text fw={600} size="sm">{ex.shortname}</Text>
      <Text size="xs" color="dimmed">Reg: {ex.regNumber}</Text>
    </Card>
  ))}
</SimpleGrid>



      {/* 🔴 Delete Confirmation Modal */}
      <Modal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
        centered
      >
        <Text>Are you sure you want to delete this excavator?</Text>
        <Group mt="md">
          <Button variant="default" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>Delete</Button>
        </Group>
      </Modal>

      {/* 📝 Add Log Modal */}
      <Modal
        opened={logModal}
        onClose={() => setLogModal(false)}
        title={`Add Log for ${selectedExcavator?.shortname}`}
        centered
      >
        <Stack>
<Radio.Group
  label="Attachment"
  value={attachment}
  onChange={setAttachment}
>
  <Radio value="BUCKET" label="Bucket" />
  <Radio value="BREAKER" label="Breaker" />
</Radio.Group>
          <TextInput
            type="datetime-local"
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <TextInput
            type="datetime-local"
            label="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <TextInput
            label="Diesel (Litres)"
            type="number"
            value={diesel}
            onChange={(e) => setDiesel(e.target.value)}
          />
          <Group>
            <Button variant="default" onClick={() => setLogModal(false)}>Cancel</Button>
            <Button color="green" onClick={handleAddLog}>Save Log</Button>
          </Group>
        </Stack>
      </Modal>

      {/* ✅ Add Excavator Modal */}
      <Modal
        opened={addModal}
        onClose={() => setAddModal(false)}
        title="➕ Add Excavator"
        centered
      >
        <Stack>
          <TextInput
            label="Shortname"
            placeholder="EX-102"
            value={shortname}
            onChange={(e) => setShortname(e.target.value)}
          />
          <TextInput
            label="Registration Number"
            placeholder="GA-01-F-1234"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
          />
          <Group>
            <Button variant="default" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button color="orange" onClick={handleAddExcavator}>Save</Button>
          </Group>
        </Stack>
      </Modal>

      {/* ✅ Floating Add Button */}
      <Button
        color="orange"
        radius="xl"
        size="lg"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 1000,
        }}
        onClick={() => setAddModal(true)}
      >
        + Add Excavator
      </Button>
    </Container>
  );
}
