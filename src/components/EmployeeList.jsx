const EmployeeList = ({ employees, onDeleteEmployee, onAddEmployee }) => {
  return (
    <div className="employee-panel">
      <h2 className="employee-panel__title">Сотрудники</h2>
      <button
        className="app-create-button"
        type="button"
        onClick={onAddEmployee}
      >
        Добавить сотрудника
      </button>
      {employees.length === 0 ? (
        <p className="employee-panel__empty">Список сотрудников пуст.</p>
      ) : (
        <ul className="employee-panel__list">
          {employees.map((employee) => (
            <li key={employee.id} className="employee-panel__item">
              <button
                type="button"
                onClick={() => onDeleteEmployee(employee.id)}
                aria-label="Удалить сотрудника"
                className="employee-panel__delete"
              >
                ×
              </button>
              <div className="employee-panel__name">
                <div class="imgBox">
                  <svg
                    viewBox="0 0 16 16"
                    class="bi bi-person-circle"
                    fill="currentColor"
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                    <path
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                {employee.fields.Name} {employee.fields.Surname}
              </div>
              <div className="employee-panel__phone">
                {employee.fields.Phone.replace(/\D/g, "").replace(
                  /^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/,
                  "+7 ($2) $3-$4-$5",
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
