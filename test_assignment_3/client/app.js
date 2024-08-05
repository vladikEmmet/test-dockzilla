const API_URL = "http://localhost:4200/api"; // Должно быть в .env, оставил для простоты установки
let date;

function createTodoProxy(todos, onUpdate) {
    return new Proxy(todos, {
        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            if (property !== 'length') {
                onUpdate();
            }
            return result;
        },
        deleteProperty(target, property) {
            const result = Reflect.deleteProperty(target, property);
            if (property !== 'length') {
                onUpdate();
            }
            return result;
        }
    });
}

let todos = createTodoProxy([], updateTodoList);

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
    const filteredTasks = todos.filter(task => task.date === date);
    updateTodoList(filteredTasks);
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
            todos.splice(0, todos.length, ...data);
        });
}

function updateTodoList(tasks = todos) {
    const todosList = document.querySelector('.todos-list');
    todosList.innerHTML = '';
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

   if(target.dataset.id || target.closest.dataset.id) {

   }
});

loadAllTasks();
loadCalendar();