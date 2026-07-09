import axios from "axios";

const BASE_ID = import.meta.env.VITE_BASE_ID;
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

const client = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const getMeetings = async () => {
  const response = await client.get("/Meetings");
  return response.data.records;
};

export const getEmployees = async () => {
  const response = await client.get("/Employees");
  return response.data.records;
};

export const deleteMeeting = async (meetingId) => {
  const response = await client.delete(`/Meetings/${meetingId}`);
  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await client.delete(`/Employees/${employeeId}`);
  return response.data;
};

export const createMeeting = async (meetingData) => {
  const response = await client.post("/Meetings", {
    fields: meetingData,
  });
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await client.post("/Employees", {
    fields: employeeData,
  });
  return response.data;
};
