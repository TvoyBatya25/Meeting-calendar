import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfMonth, endOfMonth, startOfWeek, getDay } from "date-fns";
import ru from "date-fns/locale/ru";

const locales = {
  ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({
  meetings,
  employees,
  date,
  view,
  onNavigate,
  onView,
  onSelectEvent,
}) => {
  const handleNavigate = (nextDate, nextView, action) => {
    onNavigate(nextDate);

    if (action === "TODAY" || action === "today") {
      onView(Views.DAY);
      return;
    }

    if (nextView) {
      onView(nextView);
    }
  };

  const handleView = (nextView) => {
    if (nextView === Views.AGENDA) {
      onNavigate(startOfMonth(new Date()));
    }

    onView(nextView);
  };

  const formatMonthRange = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return `${format(monthStart, "dd.MM.yyyy", { locale: ru })} - ${format(
      monthEnd,
      "dd.MM.yyyy",
      { locale: ru },
    )}`;
  };

  const events = useMemo(
    () =>
      meetings.map((meeting) => {
        const participants = Array.isArray(meeting.fields.Participants)
          ? meeting.fields.Participants
          : [];

        const participantNames = participants
          .map((participant) => {
            const participantId =
              typeof participant === "string" ? participant : participant?.id;
            const employee = employees.find(
              (item) => item.id === participantId,
            );
            return employee
              ? `${employee.fields.Name} ${employee.fields.Surname}`.trim()
              : "";
          })
          .filter(Boolean);

        return {
          id: meeting.id,
          title: participantNames.length
            ? `${meeting.fields.Name} • ${participantNames.join(", ")}`
            : meeting.fields.Name,
          start: new Date(meeting.fields.StartTime),
          end: new Date(meeting.fields.EndTime),
          resource: meeting,
        };
      }),
    [employees, meetings],
  );

  return (
    <div>
      <div style={{ height: "700px" }}>
        <Calendar
          localizer={localizer}
          culture="ru"
          events={events}
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleView}
          onSelectEvent={onSelectEvent}
          toolbar={true}
          formats={{ monthHeaderFormat: formatMonthRange }}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          messages={{
            allDay: "Весь день",
            previous: "Назад",
            next: "Вперёд",
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            agenda: "Список",
            date: "Дата",
            time: "Время",
            event: "Встреча",
            noEventsInRange: "Нет встреч в выбранном диапазоне",
            showMore: (total) => `ещё ${total}`,
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
