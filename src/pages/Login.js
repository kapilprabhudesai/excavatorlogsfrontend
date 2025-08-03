import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { TextInput, PasswordInput, Button, Paper, Title, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      setToken(res.token);
      localStorage.setItem("token", res.token);
      notifications.show({ message: "Login successful", color: "green" });
      navigate("/excavators");
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

  return (
    <Paper shadow="md" p="lg" radius="md" withBorder style={{ maxWidth: 400, margin: "100px auto" }}>
      <Title order={2} align="center" mb="md">Time Logger</Title>
 
      <Stack>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button color="orange" onClick={handleLogin} fullWidth>Login</Button>
      </Stack>
    </Paper>
  );
}
