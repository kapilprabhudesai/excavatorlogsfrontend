import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getLogsReport,deleteExcavator ,addLog,deleteLog} from "../api";
import { Trash,ArrowLeft } from "lucide-react"
import TimePicker from 'react-time-picker';

import 'react-time-picker/dist/TimePicker.css';
 

import {
  TextInput,
  Radio,
  Modal,
  Container,
  Title,
  Stack,
  Accordion,
  Card,
  Text,
  Group,
  Loader,
  Badge,
  Flex,
  Button
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
function getFirstLastDayOfCurrentMonth() {
  const now = new Date();

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toLocaleDateString("en-CA"); // stays local, no UTC shift

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toLocaleDateString("en-CA");

  return [firstDay, lastDay];
}


function formatDuration(hours, minutes) {
  return `${hours} h ${minutes} m`;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const dayWithOrdinal = day + getOrdinal(day);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];

  const year = String(date.getFullYear()).slice(2); // last 2 digits

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  return `${dayWithOrdinal} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}

export default function LogsReport({ token }) {
  const location = useLocation();

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  const query = useQuery();
  const paramExcavatorId = query.get("excavatorId") || "";
 const navigate = useNavigate();
  const [excavatorId] = useState(paramExcavatorId);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState(null);
   const [logModal, setLogModal] = useState(false);
     const [selectedExcavator, setSelectedExcavator] = useState(null);
       const [attachment, setAttachment] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [diesel, setDiesel] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const [firstDay, lastDay] = getFirstLastDayOfCurrentMonth();
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);


    const handleAddLog = async () => {
    if (!attachment || !startDate || !endDate) {
      notifications.show({ message: "Please select attachment and date range", color: "red" });
      return;
    }
     const offsetMinutes = new Date().getTimezoneOffset();
    let startDateEpoch = selectedDate + "T" + startTime;
    let endDateEpoch = selectedDate + "T" + endTime;


           

         startDateEpoch = (new Date(startDateEpoch).getTime()) ;
         endDateEpoch = (new Date(endDateEpoch).getTime()) ;
if(startDateEpoch > endDateEpoch) {
      notifications.show({ message: "Start time cannot be after end time", color: "red" });
      return;
    }
    if (isNaN(startDateEpoch) || isNaN(endDateEpoch)) {
      notifications.show({ message: "Invalid date range", color: "red" });
      return;
    }

    try {
      await addLog(token, {
        excavatorId: parseInt(excavatorId),
        attachment,
        startTime: startDateEpoch,
        endTime: endDateEpoch,
        diesel: Number(diesel),
      });
      notifications.show({ message: "Log added successfully", color: "green" });
      setLogModal(false);
      // Clear form
      setAttachment("");
      setStartTime("");
      setEndTime("");
      setDiesel("");
      fetchReport(excavatorId, startDate, endDate)
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };


    const handleDelete = async () => {
    try {
      await deleteExcavator(token, excavatorId);
      notifications.show({ message: "Excavator deleted", color: "green" });

    navigate("/excavators")
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

      const handleLogDelete = async () => {
    try {
      await deleteLog(token, deleteLogId);
      notifications.show({ message: "Log deleted", color: "green" });
      fetchReport(excavatorId, startDate, endDate)
      setDeleteLogId(null)
         
    
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    }
  };

  

  useEffect(() => {
    if (excavatorId && startDate && endDate) {
      fetchReport(excavatorId, startDate, endDate);
    }
  }, [excavatorId, startDate, endDate]);

  const fetchReport = async (excavatorId, startDate, endDate) => {
    setLoading(true);
    try {
        const offsetMinutes = new Date().getTimezoneOffset();

        let startDateEpoch = (new Date(startDate).getTime() + offsetMinutes * 60 * 1000) ;
        let endDateEpoch = (new Date(endDate).getTime() + offsetMinutes * 60 * 1000) ;

        if (isNaN(startDateEpoch) || isNaN(endDateEpoch)) {
          notifications.show({ message: "Invalid date range", color: "red" });
          return;
        }
      const res = await getLogsReport(token, excavatorId, startDateEpoch, endDateEpoch);
      setReport(res);
      notifications.show({ message: "Report fetched", color: "green" });
    } catch (err) {
      notifications.show({ message: err.message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container my="lg" style={{ maxWidth: 700 }}>
      <Title order={2} mb="md">
        <ArrowLeft onClick={()=>navigate("/excavators")} className="w-4 h-4 mr-2" /> <small style={{color:"orange"}}>{report?.excavator?.shortname}</small>
      </Title>
          <Modal
  opened={logModal}
  onClose={() => setLogModal(false)}
  centered
>
  <Stack spacing="md">
    {/* Attachment Selection */}
    <Radio.Group
      label="Attachment"
      value={attachment}
      onChange={setAttachment}
      required
    >
      <Radio value="BUCKET" label="Bucket" />
      <Radio value="BREAKER" label="Breaker" />
    </Radio.Group>

    {/* Date Selection */}
    <TextInput
      type="date"
      label="Date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      required
    />

   
    <label htmlFor="start-time">Start Time</label>
<TimePicker
  id="start-time"
  onChange={setStartTime}
  value={startTime}
  format="hh:mm a"
   disableClock={true}
/>

<label htmlFor="end-time">End Time</label>
<TimePicker
  id="end-time"
  onChange={setEndTime}
  value={endTime}
  format="hh:mm a"
   disableClock={true}
/>


    {/* Diesel */}
    <TextInput
      label="Diesel (Litres)"
      type="number"
      min="0"
      value={diesel}
      onChange={(e) => setDiesel(e.target.value)}
    />

    {/* Error Display */}
    {error && <Text color="red">{error}</Text>}

    {/* Actions */}
    <Group position="apart">
      <Button variant="default" onClick={() => setLogModal(false)}>Cancel</Button>
      <Button color="orange" onClick={handleAddLog}>Save Log</Button>
    </Group>
  </Stack>
</Modal>



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


          <Modal
            opened={!!deleteLogId}
            onClose={() => setDeleteLogId(null)}
            title="Confirm Delete"
            centered
          >
            <Text>Are you sure you want to delete this log?</Text>
            <Group mt="md">
              <Button variant="default" onClick={() => setDeleteLogId(null)}>Cancel</Button>
              <Button color="red" onClick={handleLogDelete}>Delete</Button>
            </Group>
          </Modal>

      <Stack spacing="md" mb="md">
        {/* Show excavator reg no and shortcode as badges if data loaded */}
        {report?.excavator && (
        <Flex gap="md" mb="md" justify="space-between" align="center">
  <Badge color="green" variant="outline" size="lg">
    {report.excavator.regNumber}
  </Badge>

  <Button
    size="xs"
    color="red"
    variant="light"
    onClick={() => setDeleteId(true)}
  >
    <Trash className="w-4 h-4 mr-2" />
    Delete
  </Button>
</Flex>
        )}

        <TextInput
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextInput
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button color="orange" onClick={() => fetchReport(excavatorId, startDate, endDate)} loading={loading}>
          Get Report
        </Button>
      </Stack>

      {loading && <Loader size="sm" />}

      {report && (
        <>
          <Card shadow="sm" padding="md" mb="md">
            <Title order={4}>Statistics</Title>
            <Group position="apart" mb="xs">
              <Text weight={500}>Total Fuel:</Text>
              <Text>{report.totalDiesel.toFixed(0)} Ltrs</Text>
            </Group>
            <Group position="apart" mb="xs">
              <Text weight={500}>Average Fuel/Hr:</Text>
              <Text>{report.avgFuel.toFixed(0)} Ltrs</Text>
            </Group>
            <Group position="apart" mb="xs">
              <Text weight={500}>Bucket Time:</Text>
              <Text>{formatDuration(report.bucket.hours, report.bucket.minutes)}</Text>
            </Group>
            <Group position="apart" mb="xs">
              <Text weight={500}>Breaker Time:</Text>
              <Text>{formatDuration(report.breaker.hours, report.breaker.minutes)}</Text>
            </Group>
          </Card>

          <Title order={4} mb="sm">
            Logs
          </Title>
          {report.logs && report.logs.length > 0 ? (
            <Accordion>
              {report.logs.map((log) => (
                <Accordion.Item key={log.id} value={String(log.id)}>
                  <Accordion.Control>
                    {formatDate(log.startTime)}  {log.attachment}  (Dsl:{log.diesel} L)
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text><b>Start Time:</b> {formatDate(log.startTime)}</Text>
                    <Text><b>End Time:</b> {formatDate(log.endTime)}</Text>
                    <Text><b>Diesel Loaded:</b> {log.diesel} L</Text>
                    <Text><b>Attachment:</b> {log.attachment}</Text>
                      <Button
    size="xs"
    color="red"
    variant="light"
    onClick={() => setDeleteLogId(log.id)}
  >
    <Trash className="w-4 h-4 mr-2" />
    Delete
  </Button>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <Text>No logs found.</Text>
          )}
        </>
      )}
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
        onClick={() => setLogModal(true)}
      >
        +
      </Button>
    </Container>
  );
}
