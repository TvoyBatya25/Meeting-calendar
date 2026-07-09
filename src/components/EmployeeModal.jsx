import { useEffect, useState } from "react";

const initialForm = {
  Name: "",
  Surname: "",
  Phone: "",
};

const EmployeeModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setIsSaving(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

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

        <h3 className="modal-title">Новый сотрудник</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            placeholder="Имя"
            value={form.Name}
            onChange={(e) => setForm({ ...form, Name: e.target.value })}
            required
          />
          <input
            className="modal-input"
            placeholder="Фамилия"
            value={form.Surname}
            onChange={(e) => setForm({ ...form, Surname: e.target.value })}
            required
          />
          <input
            className="modal-input"
            placeholder="Телефон"
            value={form.Phone}
            onChange={(e) => setForm({ ...form, Phone: e.target.value })}
            required
          />

          <div className="modal-actions">
            <button className="app-create-button" type="submit" disabled={isSaving}>
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
