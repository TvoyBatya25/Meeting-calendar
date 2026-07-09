const MeetingDetailsModal = ({
  isOpen,
  meeting,
  getParticipantNames,
  onClose,
  onDeleteMeeting,
}) => {
  if (!isOpen || !meeting) {
    return null;
  }

  const participants = Array.isArray(meeting.fields.Participants)
    ? meeting.fields.Participants
    : [];

  const participantNames = getParticipantNames(participants);

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1100,
      }}
    >
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "520px",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "32px",
            height: "32px",
            border: "none",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.35)",
            cursor: "pointer",
            fontSize: "25px",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
          {meeting.fields.Name}
        </h3>

        <div style={{ display: "grid", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              Название встречи
            </div>
            <div style={{ fontWeight: 600 }}>{meeting.fields.Name}</div>
          </div>

          <div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>Время</div>
            <div style={{ fontWeight: 500 }}>
              {formatDateTime(meeting.fields.StartTime)} -{" "}
              {formatDateTime(meeting.fields.EndTime)}
            </div>
          </div>

          <div>
            <div
              style={{ fontSize: "14px", opacity: 0.7, marginBottom: "6px" }}
            >
              Участники
            </div>
            {participantNames.length > 0 ? (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  display: "grid",
                  gap: "6px",
                  listStyle: "none",
                }}
              >
                {participantNames.map((name, index) => (
                  <li key={`${name}-${index}`}>{name}</li>
                ))}
              </ul>
            ) : (
              <div>Нет участников</div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <button
            className="app-create-button"
            type="button"
            onClick={() => onDeleteMeeting(meeting.id)}
          >
            Удалить встречу
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;
