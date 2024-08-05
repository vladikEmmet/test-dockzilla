const API_URL = 'http://localhost:8080';
let students = [];

const studentForm = document.getElementById('studentForm');
const studentList = document.querySelector('#studentList tbody');

const studentsProxy = new Proxy(students, {
    set(target, property, value, receiver) {
        const result = Reflect.set(target, property, value, receiver);
        renderStudentsList();
        return result;
    },
    deleteProperty(target, property) {
        const result = Reflect.deleteProperty(target, property);
        renderStudentsList();
        return result;
    }
});

studentForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const student = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        middleName: document.getElementById('middleName').value,
        birthDate: document.getElementById('birthDate').value,
        groupName: document.getElementById('groupName').value,
        uniqueNumber: document.getElementById('uniqueNumber').value
    };

    fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(student).toString()
    })
        .then(response => {
            console.log(response);
            if(!response.ok) {
                console.log(response);
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            studentsProxy.push(student);
        })
        .catch(err => {
            alert(err.message);
        });
});

function renderStudentRow(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.middleName}</td>
                <td>${student.birthDate}</td>
                <td>${student.groupName}</td>
                <td>${student.uniqueNumber}</td>
                <td>
                    <button onclick="removeStudent('${student.uniqueNumber}')">Delete</button>
                </td>
            `;

    return row;
}

function renderStudentsList() {
    studentList.innerHTML = '';
    students.forEach(student => {
        const row = renderStudentRow(student);
        studentList.appendChild(row);
    });
}

function setLoading(isLoading) {
    const studentList = document.querySelector('#studentList tbody');

    if (isLoading) {
        if (!document.getElementById('loading')) {
            const loading = document.createElement('tr');
            const loadingCell = document.createElement('td');
            loadingCell.setAttribute('colspan', 7);
            loadingCell.textContent = 'Loading...';
            loadingCell.id = 'loading';
            loading.appendChild(loadingCell);
            studentList.appendChild(loading);
        }
        return;
    }

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        studentList.removeChild(loadingElement);
    }
}


function loadStudents() {
    setLoading(true);
    fetch(`${API_URL}/students`)
        .then(response => response.json())
        .then(data => {
            studentsProxy.length = 0; // Clear the array
            studentsProxy.push(...data);
        })
        .catch(err => {
            alert(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
}

function removeStudent(uniqueNumber) {
    fetch(`${API_URL}/students?uniqueNumber=${uniqueNumber}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            const index = students.findIndex(student => student.uniqueNumber === uniqueNumber);
            if (index > -1) {
                studentsProxy.splice(index, 1);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadStudents);
