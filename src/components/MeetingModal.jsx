import { useEffect, useMemo, useState } from "react";

const initialForm = {
  Name: "",
  StartTime: "",
  EndTime: "",
  Participants: [],
};

const MeetingModal = ({ isOpen, onClose, onSave, employees = [] }) => {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setIsSaving(false);
    }
  }, [isOpen]);

  const selectedCount = form.Participants.length;
  const canCreate = selectedCount >= 2;

  const selectedSet = useMemo(
    () => new Set(form.Participants),
    [form.Participants],
  );

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canCreate) {
      return;
    }

    setIsSaving(true);
    try {
      const saved = await onSave(form);
      if (saved !== false) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleParticipant = (employeeId) => {
    setForm((current) => {
      const exists = current.Participants.includes(employeeId);
      return {
        ...current,
        Participants: exists
          ? current.Participants.filter((id) => id !== employeeId)
          : [...current.Participants, employeeId],
      };
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-surface"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h3 className="modal-title">Создать встречу</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            placeholder="Название"
            value={form.Name}
            onChange={(e) => setForm({ ...form, Name: e.target.value })}
            required
          />
          <input
            className="modal-input"
            type="datetime-local"
            value={form.StartTime}
            onChange={(e) => setForm({ ...form, StartTime: e.target.value })}
            required
          />
          <input
            className="modal-input"
            type="datetime-local"
            value={form.EndTime}
            onChange={(e) => setForm({ ...form, EndTime: e.target.value })}
            required
          />

          <div className="modal-helper">
            Выберите минимум 2 сотрудников
            <span style={{ marginLeft: "8px", fontWeight: 600 }}>
              {selectedCount > 0 ? `(${selectedCount})` : ""}
            </span>
          </div>

          {employees.length > 0 ? (
            <div className="participant-list">
              {employees.map((employee) => {
                const employeeId = employee.id;
                const employeeName = `${employee.fields.Name} ${
                  employee.fields.Surname ?? ""
                }`.trim();
                const isChecked = selectedSet.has(employeeId);

                return (
                  <label
                    key={employeeId}
                    className={`participant-item${isChecked ? " participant-item--selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleParticipant(employeeId)}
                    />
                    <span className="participant-item__name">
                      {employeeName}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="modal-helper">
              Список сотрудников загружается или пока пуст.
            </div>
          )}

          <div className="modal-actions">
            <button
              className="app-create-button"
              type="submit"
              disabled={isSaving || !canCreate}
            >
              {isSaving ? "Сохранение..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;
