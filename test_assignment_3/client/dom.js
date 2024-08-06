import {parseTimestamp} from "./utils.js";

export function showLoader() {
    const list = document.querySelector('.todos-list');
    list.innerHTML = '';

    const loader = document.createElement('div');
    loader.classList.add('loader');
    list.appendChild(loader);
}

export function hideLoader() {
    const loader = document.querySelector('.loader');
    if(loader) {
        loader.remove();
    }
}

export function showErrorMessage() {
    const todosList = document.querySelector('.todos-list');
    todosList.innerHTML = '';
    const errorMessage = document.createElement('strong');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Произошла ошибка при загрузке данных. Попробуйте позже.';
    todosList.appendChild(errorMessage);
}

export function removeAllActiveDates() {
    const dates = document.querySelectorAll('.date');
    dates.forEach(date => {
        if(date.dataset.task) {
            date.removeAttribute('data-task');
        }
    });
}

export function createEmptyCell(datesContainer) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('date');
    datesContainer.appendChild(emptyCell);
}

export function renderMainTaskInfo(task) {
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

export function renderTaskDetails(task) {
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

export function renderTask(task) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('todo-container');
    const mainInfo = renderMainTaskInfo(task);
    const details = renderTaskDetails(task);

    taskContainer.appendChild(mainInfo);
    taskContainer.appendChild(details);

    taskContainer.setAttribute('data-id', task.id);

    return taskContainer;
}

export function renderTasks(tasks) {
    const todosList = document.querySelector('.todos-list');
    for(const task of tasks) {
        const renderedTask = renderTask(task);
        todosList.appendChild(renderedTask);
    }
}

export function renderEmptyCell(datesContainer, firstDay) {
    for (let i = 0; i < firstDay; i++) {
        createEmptyCell(datesContainer);
    }
}