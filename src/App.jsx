import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import {
  createEmployee,
  createMeeting,
  deleteEmployee,
  deleteMeeting,
  getEmployees,
  getMeetings,
} from "./api";
import EmployeeList from "./components/EmployeeList";
import EmployeeModal from "./components/EmployeeModal";
import CalendarView from "./components/CalendarView";
import MeetingModal from "./components/MeetingModal";
import MeetingDetailsModal from "./components/MeetingDetailsModal";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month");
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] =
    useState(false);

  const loadMeetings = async () => {
    const data = await getMeetings();
    setMeetings(data);
  };

  const loadEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    loadMeetings();
    loadEmployees();
  }, []);

  const handleSaveMeeting = async (form) => {
    const newStart = new Date(form.StartTime).getTime();
    const newEnd = new Date(form.EndTime).getTime();

    if (Number.isNaN(newStart) || Number.isNaN(newEnd)) {
      alert("Проверьте дату и время встречи.");
      return false;
    }

    if (newStart >= newEnd) {
      alert("Время окончания должно быть позже времени начала.");
      return false;
    }

    if (!Array.isArray(form.Participants) || form.Participants.length < 2) {
      alert("Для встречи нужно выбрать как минимум двух сотрудников.");
      return false;
    }

    const conflict = meetings.find((meeting) => {
      const start = new Date(meeting.fields.StartTime).getTime();
      const end = new Date(meeting.fields.EndTime).getTime();
      return newStart < end && newEnd > start;
    });

    if (conflict) {
      alert(`На это время уже есть встреча: ${conflict.fields.Name}`);
      return false;
    }

    await createMeeting(form);
    await loadMeetings();
    return true;
  };

  const handleSaveEmployee = async (form) => {
    const name = form.Name.trim();
    const surname = form.Surname.trim();
    const phoneDigits = String(form.Phone ?? "").replace(/\D/g, "");

    if (!name || !surname || !phoneDigits) {
      alert("Заполните имя, фамилию и телефон сотрудника.");
      return false;
    }

    let normalizedDigits = phoneDigits;
    if (
      normalizedDigits.length === 11 &&
      (normalizedDigits.startsWith("7") || normalizedDigits.startsWith("8"))
    ) {
      normalizedDigits = normalizedDigits.slice(1);
    }

    if (normalizedDigits.length !== 10) {
      alert(
        "Введите номер телефона в формате 10 цифр или 11 цифр с кодом страны.",
      );
      return false;
    }

    const phone = `+7 (${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(
      3,
      6,
    )}-${normalizedDigits.slice(6, 8)}-${normalizedDigits.slice(8, 10)}`;

    await createEmployee({
      Name: name,
      Surname: surname,
      Phone: phone,
    });

    await loadEmployees();
    return true;
  };

  const getParticipantNames = (participants) => {
    if (!Array.isArray(participants)) {
      return [];
    }

    return participants
      .map((participant) => {
        const participantId =
          typeof participant === "string" ? participant : participant?.id;
        const employee = employees.find((item) => item.id === participantId);
        return employee
          ? `${employee.fields.Name} ${employee.fields.Surname}`.trim()
          : "";
      })
      .filter(Boolean);
  };

  const handleSelectMeeting = (event) => {
    const meeting = event?.resource ?? event;
    setSelectedMeeting(meeting);
    setIsMeetingDetailsModalOpen(true);
  };

  const handleDeleteMeeting = async (meetingId) => {
    const confirmed = window.confirm("Удалить эту встречу?");
    if (!confirmed) {
      return;
    }

    await deleteMeeting(meetingId);
    await loadMeetings();
    setIsMeetingDetailsModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleDeleteEmployee = async (employeeId) => {
    const employee = employees.find((item) => item.id === employeeId);
    const confirmed = window.confirm(
      `Удалить сотрудника "${employee?.fields?.Name ?? ""} ${
        employee?.fields?.Surname ?? ""
      }"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteEmployee(employeeId);
    await loadMeetings();
    await loadEmployees();
  };

  return (
    <div className="app-shell">
      <h1>Календарь встреч</h1>

      <div className="app-actions">
        <div className="app-create-actions">
          <button
            className="app-create-button"
            type="button"
            onClick={() => setIsMeetingModalOpen(true)}
          >
            Создать встречу
          </button>
        </div>
      </div>

      <div className="app-layout">
        <main className="app-main">
          <CalendarView
            meetings={meetings}
            employees={employees}
            date={calendarDate}
            view={calendarView}
            onNavigate={setCalendarDate}
            onView={setCalendarView}
            onSelectEvent={handleSelectMeeting}
          />
        </main>

        <aside className="app-sidebar">
          <EmployeeList
            employees={employees}
            onDeleteEmployee={handleDeleteEmployee}
            onAddEmployee={() => setIsEmployeeModalOpen(true)}
          />
        </aside>
      </div>

      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        onSave={handleSaveMeeting}
        employees={employees}
      />

      <MeetingDetailsModal
        isOpen={isMeetingDetailsModalOpen}
        meeting={selectedMeeting}
        getParticipantNames={getParticipantNames}
        onClose={() => {
          setIsMeetingDetailsModalOpen(false);
          setSelectedMeeting(null);
        }}
        onDeleteMeeting={handleDeleteMeeting}
      />

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

export default App;
