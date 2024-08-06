const API_URL = "http://localhost:4200/api";
let sortType = 'asc';
let todos = [];
let allTasks = [];
let onlyIncompleted = false;
let fromDate, toDate;
const filterCheckbox = document.querySelector('#filter-checkbox');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function createEmptyCell(datesContainer) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('date');
    datesContainer.appendChild(emptyCell);
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

function removeAllActiveDates() {
    const dates = document.querySelectorAll('.date');
    dates.forEach(date => {
        if(date.dataset.task) {
            date.removeAttribute('data-task');
        }
    });
}

function renderSingleCellWithDate(datesContainer, idx) {
    const dateCell = document.createElement('div');
    dateCell.classList.add('date');
    dateCell.dataset.date = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(idx)}`;
    dateCell.innerHTML = idx;
    dateCell.onclick = function() {
        const startDate = new Date(`${this.dataset.date}T00:00:00`).getTime();
        const endDate = new Date(`${this.dataset.date}T23:59:59`).getTime();
        if(fromDate === startDate && endDate === toDate && this.dataset.task) {
            this.removeAttribute('data-task');
            loadAllTasks();
            return;
        }

        removeAllActiveDates();
        this.setAttribute('data-task', true);
        loadTasks(startDate, endDate);
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

function loadTasks(from, to) {
    fromDate = from;
    toDate = to;

    fetch(`${API_URL}/todos/date?from=${from}` + (to ? `&to=${to}` : '') + (onlyIncompleted ? '&status=false' : ''))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            return response.json();
        })
        .then(data => {
            todos = [...data];
            allTasks = [...todos];
            updateTodoList();
        })
        .catch(console.error);
}

function loadAllTasks() {
    return fetch(`${API_URL}/todos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            return response.json();
        })
        .then(data => {
            todos = [...data];
            allTasks = [...todos];
            updateTodoList();
        });
}

function updateTodoList(tasks = todos) {
    const todosList = document.querySelector('.todos-list');
    todosList.innerHTML = '';
    if(tasks.length <= 0) {
        const noTasksContainer = document.createElement('div');
        const noTasks = document.createElement('strong');
        noTasksContainer.classList.add('no-tasks-container');
        noTasks.classList.add('no-tasks');
        noTasks.textContent = 'Ничего нет или всё сделано — в любом случае, вы молодец!';
        noTasksContainer.appendChild(noTasks);
        todosList.appendChild(noTasksContainer);
        return;
    }
    renderTasks(tasks);
}

function renderMainTaskInfo(task) {
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('todo-info');
    const title = document.createElement('h3');
    title.innerHTML = task.name;
    const description = document.createElement('p');
    description.innerHTML = task.shortdesc;
    taskInfo.appendChild(title);
    taskInfo.appendChild(description);

    return taskInfo;
}

function renderTaskDetails(task) {
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('todo-details');

    const parsedDate = parseTimestamp(task.date);
    const date = document.createElement('p');
    date.innerHTML = parsedDate;

    const icon = document.createElement('img');
    icon.src = task.status ? 'assets/icons/checked.png' : "assets/icons/not-checked.png";
    icon.alt = task.status ? 'Completed' : 'Not completed';
    icon.setAttribute('data-aim', 'status');

    taskDetails.appendChild(icon);
    taskDetails.appendChild(date);

    return taskDetails;
}

function renderTask(task) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('todo-container');
    const mainInfo = renderMainTaskInfo(task);
    const details = renderTaskDetails(task);

    taskContainer.appendChild(mainInfo);
    taskContainer.appendChild(details);

    taskContainer.setAttribute('data-id', task.id);

    return taskContainer;
}

function renderTasks(tasks) {
    const todosList = document.querySelector('.todos-list');
    for(const task of tasks) {
        const renderedTask = renderTask(task);
        todosList.appendChild(renderedTask);
    }
}

async function loadAndRenderAllTasks() {
    await loadAllTasks();
    updateTodoList();
}

function updateTodoItem(updatedTask) {
    const todosList = document.querySelector('.todos-list');
    const taskElement = todosList.querySelector(`[data-id="${updatedTask.id}"]`);
    todos.find(t => t.id === updatedTask.id).status = updatedTask.status;
    if (taskElement) {
        const img = taskElement.querySelector('img');
        img.src = updatedTask.status ? 'assets/icons/checked.png' : "assets/icons/not-checked.png";
    }
}

function toggleTaskStatus(taskId, newStatus) {
    const task = todos.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        updateTodoItem(task);
    }
}

function parseTimestamp(timestamptz) {
    const date = new Date(timestamptz);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

document.addEventListener('click', (e) => {
    const target = e.target;
    if(target.dataset.aim === 'status') {
        const taskId = target.closest('.todo-container').dataset.id;
        const newStatus = target.src.includes('not-checked');
        toggleTaskStatus(taskId, newStatus);

        return;
    }

    if(target?.dataset.id || target?.closest?.dataset?.id) {
        const modal = document.querySelector('#todo-dialog');
        const task = todos.find(t => t.id === (target.dataset.id || target.closest.dataset.id));
        modal.querySelector('.dialog-title').textContent = task.name;
        modal.querySelector('.dialog-date').textContent = parseTimestamp(task.date);
        modal.querySelector('.dialog-description').textContent = task.fulldesc;

        const img = document.createElement('img');
        img.src = task.status ? 'assets/icons/checked.png' : "assets/icons/not-checked.png";
        img.alt = task.status ? 'Completed' : 'Not completed';

        img.addEventListener('click', () => {
            toggleTaskStatus(task.id, !task.status);
            img.src = task.status ? 'assets/icons/checked.png' : "assets/icons/not-checked.png";
        });

        modal.querySelector('.dialog-img').innerHTML = '';
        modal.querySelector('.dialog-img').appendChild(img);

        modal.showModal();
    }

    if(target?.dataset?.aim === 'close-modal') {
        const modal = document.querySelector('#todo-dialog');
        modal.close();
    }

    if(target?.dataset?.aim === "sort") {
        if(sortType === 'asc') {
            sortType = 'desc';
            const sortedTasks = todos.sort((a, b) => a.date.localeCompare(b.date));
            updateTodoList(sortedTasks);
        } else {
            sortType = 'asc';
            const sortedTasks = todos.sort((a, b) => b.date.localeCompare(a.date));
            updateTodoList(sortedTasks);
        }
        document.querySelector('.sort-icon').classList.toggle('rotate');
    }
});

filterCheckbox.querySelector('input').addEventListener('change', function () {
    onlyIncompleted = this.checked;

    if(!this.checked && fromDate && toDate) {
        loadTasks(fromDate, toDate);
        return;
    }

    if(this.checked) {
        todos = allTasks.filter(t => !t.status);
    } else {
        todos = [...allTasks];
    }

    updateTodoList();
});

document.querySelector('#get-today-tasks').addEventListener('click', () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).getTime();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).getTime();

    if(startOfDay === fromDate && endOfDay === toDate) {
        return;
    }

    loadTasks(startOfDay, endOfDay);
});

document.querySelector('#get-tasks-for-week').addEventListener('click', () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const startDayOffset = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - startDayOffset, 0, 0, 0, 0).getTime();
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - startDayOffset), 23, 59, 59, 999).getTime();

    if(startOfWeek === fromDate && endOfWeek === toDate) {
        return;
    }

    loadTasks(startOfWeek, endOfWeek);
});


loadAllTasks();
loadCalendar();