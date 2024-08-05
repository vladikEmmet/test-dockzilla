const API_URL = "http://localhost:4200/api" // Должно быть в .env, оставил для простоты установки
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function createEmptyCell(datesContainer) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('date');
    datesContainer.appendChild(emptyCell);
}

function renderSingleCellWithDate(datesContainer, idx) {
    const dateCell = document.createElement('div');
    dateCell.classList.add('date');
    dateCell.dataset.date = `${currentYear}-${currentMonth + 1}-${idx}`;
    dateCell.innerHTML = idx;
    dateCell.onclick = function() {
        loadTasks(this.dataset.date);
    };
    datesContainer.appendChild(dateCell);
}

function renderEmptyCell(datesContainer, firstDay) {
    for (let i = 0; i < firstDay; i++) {
        createEmptyCell(datesContainer);
    }
}

function renderCellsWithDate(daysInMonth, datesContainer) {
    for (let i = 1; i <= daysInMonth; i++) {
        renderSingleCellWithDate(datesContainer, i);
    }
}

function loadCalendar() {
    const datesContainer = document.getElementById('dates');
    datesContainer.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    renderEmptyCell(datesContainer, firstDay);

    renderCellsWithDate(daysInMonth, datesContainer);

    document.getElementById('month-year').innerHTML = `${monthNames[currentMonth]} ${currentYear}`;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar();
}

document.querySelector('#prev').addEventListener('click', () => changeMonth(-1));
document.querySelector('#next').addEventListener('click', () => changeMonth(1));

function loadTasks(date) {

}

function loadAllTasks() {
    fetch(`${API_URL}/todos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            return response.json();
        })
        .then(data => {
            return data;
        });
}

function renderTasks(tasks) {

}

loadAllTasks();

loadCalendar();
