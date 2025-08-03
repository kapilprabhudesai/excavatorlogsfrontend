import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addExcavator } from "../api";
import { TextInput, Button, Container, Title, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function AddExcavator({ token }) {
  const [shortname, setShortname] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await addExcavator(token, { shortname, regNumber });
      notifications.show({ message: "Excavator added", color: "green" });
      navigate("/excavators");
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

  return (
    <Container my="lg" style={{ maxWidth: 400 }}>
      <Title order={2} mb="md">➕ Add Excavator</Title>
      <Stack>
        <TextInput
          label="Shortname"
          placeholder="EX-102"
          value={shortname}
          onChange={(e) => setShortname(e.target.value)}
        />
        <TextInput
          label="Registration Number"
          placeholder="REG-1234"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
        />
        <Button onClick={handleAdd}>Add Excavator</Button>
      </Stack>
    </Container>
  );
}
