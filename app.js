const listForm = document.getElementById('listForm');
const listContainer = document.getElementById('listContainer');
let lists = [];
let filterStatus = 'all';

// Fait les listes
function displayLists() {
    listContainer.innerHTML = '';

    lists.forEach((list, listIndex) => {
        const listElement = document.createElement('div');
        listElement.classList.add('list');
        listElement.innerHTML = `
            <h2><span id="listName${listIndex}">${list.name}</span></h2>
            
            <button onclick="deleteList(${listIndex})">Supprimer Liste</button>
            <form onsubmit="addTask(event, ${listIndex})">
                <input type="text" placeholder="Nom de la tâche" required>
                <input type="date" required>
                <button type="submit">Ajouter Tâche</button>
            </form>

            <div id="taskContainer${listIndex}"></div>
        `;

        listContainer.appendChild(listElement);
        displayTasks(listIndex);
    });
}

// Affiche les tâches 
function displayTasks(listIndex) {
    const taskContainer = document.getElementById(`taskContainer${listIndex}`);
    taskContainer.innerHTML = '';

    lists[listIndex].tasks
        .filter(task => {
            if (filterStatus === 'completed') return task.completed;
            if (filterStatus === 'incomplete') return !task.completed;
            return true;
        })
        .forEach((task, taskIndex) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            if (task.completed) taskElement.classList.add('completed');

            taskElement.innerHTML = `
                <span id="taskName${listIndex}-${taskIndex}">${task.name} - ${task.date}</span>
                <button onclick="toggleTaskStatus(${listIndex}, ${taskIndex})">
                    ${task.completed ? 'Annuler' : 'Terminer'}
                </button>
                <button onclick="editTaskName(${listIndex}, ${taskIndex})">Modifier Nom</button>
                <button onclick="editTaskDate(${listIndex}, ${taskIndex})">Modifier Date</button>
                <button onclick="deleteTask(${listIndex}, ${taskIndex})">Supprimer</button>
            `;

            taskContainer.appendChild(taskElement);
        });
}

// Ajout d'une nouvelle liste et empeche le rechargement de la page
listForm.onsubmit = function(event) {
    event.preventDefault();
    const listName = document.getElementById('listName').value;
    lists.push({ name: listName, tasks: [] });
    document.getElementById('listName').value = '';
    displayLists();
};

// Ajout d'une nouvelle tache avec date
function addTask(event, listIndex) {
    event.preventDefault();
    const taskName = event.target.querySelector('input[type="text"]').value;
    const taskDate = event.target.querySelector('input[type="date"]').value;
    lists[listIndex].tasks.push({ name: taskName, date: taskDate, completed: false });
    event.target.reset();
    displayTasks(listIndex);
}

function editTaskName(listIndex, taskIndex) {
    const newTaskName = prompt("Entrez le nouveau nom de la tâche :", lists[listIndex].tasks[taskIndex].name);
    if (newTaskName) {
        lists[listIndex].tasks[taskIndex].name = newTaskName;
        displayTasks(listIndex);
    }
}
// Permet de changer la date de la tache
function editTaskDate(listIndex, taskIndex) {
    const currentTask = lists[listIndex].tasks[taskIndex];
    const taskElement = document.getElementById(`taskName${listIndex}-${taskIndex}`);
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = currentTask.date;
    dateInput.classList.add('edit-date-input');
    dateInput.onchange = function () {
        currentTask.date = dateInput.value;
        displayTasks(listIndex);
    };
    taskElement.innerHTML = `${currentTask.name} - `;
    taskElement.appendChild(dateInput);
}

function deleteList(listIndex) {
    lists.splice(listIndex, 1);
    displayLists();
}

function deleteTask(listIndex, taskIndex) {
    lists[listIndex].tasks.splice(taskIndex, 1);
    displayTasks(listIndex);
}

// Marque ou annule une tâche comme terminée
function toggleTaskStatus(listIndex, taskIndex) {
    lists[listIndex].tasks[taskIndex].completed = !lists[listIndex].tasks[taskIndex].completed;
    displayTasks(listIndex);
}

// Définit le filtre et MAJ de l'affichage
function setFilter(status) {
    filterStatus = status;
    lists.forEach((_, index) => displayTasks(index));
}
