const employeeForm = document.querySelector("#employee-form");
const employeeList = document.querySelector("#employee-list");
const recordsBody = document.querySelector("#attendance-records");
const dateInput = document.querySelector("#attendance-date");

let employees = JSON.parse(localStorage.getItem("employees") || "[]");
let records = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");

dateInput.value = new Date().toISOString().slice(0, 10);

function saveData() {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("attendanceRecords", JSON.stringify(records));
}

function renderEmployees() {
  employeeList.replaceChildren();

  if (employees.length === 0) {
    employeeList.textContent = "Add an employee to start marking attendance.";
    return;
  }

  employees.forEach((employee) => {
    const row = document.createElement("div");
    row.className = "employee-row";

    const label = document.createElement("span");
    label.textContent = `${employee.id} — ${employee.name}`;

    const actions = document.createElement("div");

    ["Present", "Absent"].forEach((status) => {
      const button = document.createElement("button");
      button.textContent = status;
      button.addEventListener("click", () => markAttendance(employee.id, status));
      actions.append(button);
    });

    row.append(label, actions);
    employeeList.append(row);
  });
}

function markAttendance(employeeId, status) {
  const date = dateInput.value;
  if (!date) {
    alert("Please select a date first.");
    return;
  }

  const existingIndex = records.findIndex(
    (record) => record.employeeId === employeeId && record.date === date
  );

  const record = { employeeId, date, status };

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  saveData();
  renderRecords();
}

function renderRecords() {
  recordsBody.replaceChildren();

  const sortedRecords = [...records].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  sortedRecords.forEach((record) => {
    const employee = employees.find((item) => item.id === record.employeeId);
    if (!employee) return;

    const row = document.createElement("tr");

    [record.date, employee.id, employee.name, record.status].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    recordsBody.append(row);
  });
}

employeeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#employee-name").value.trim();
  const id = document.querySelector("#employee-id").value.trim();

  if (employees.some((employee) => employee.id.toLowerCase() === id.toLowerCase())) {
    alert("That employee ID already exists.");
    return;
  }

  employees.push({ id, name });
  saveData();
  renderEmployees();
  employeeForm.reset();
});

renderEmployees();
renderRecords();