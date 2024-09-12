// Select elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task event listener
addTaskBtn.addEventListener('click', addTask);

// Filter buttons event listener
filterButtons.forEach(button => {
    button.addEventListener('click', filterTasks);
});

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') return; // Don't add empty tasks

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);

    // Save task to localStorage
    saveTaskToLocalStorage(taskText);

    // Clear input field
    taskInput.value = '';
}

// Create task element
function createTaskElement(taskText, completed = false) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (completed) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="complete-btn">${completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Event listeners for actions
    li.querySelector('.complete-btn').addEventListener('click', toggleCompleteTask);
    li.querySelector('.delete-btn').addEventListener('click', deleteTask);
    li.querySelector('.edit-btn').addEventListener('click', editTask);

    return li;
}

// Toggle complete task
function toggleCompleteTask(e) {
    const taskItem = e.target.parentElement.parentElement;
    taskItem.classList.toggle('completed');
    e.target.textContent = taskItem.classList.contains('completed') ? 'Uncomplete' : 'Complete';
    
    // Update task status in localStorage
    updateTaskStatusInLocalStorage(taskItem.querySelector('.task-text').textContent, taskItem.classList.contains('completed'));
}

// Delete task
function deleteTask(e) {
    const taskItem = e.target.parentElement.parentElement;
    taskItem.remove();

    // Remove task from localStorage
    removeTaskFromLocalStorage(taskItem.querySelector('.task-text').textContent);
}

// Edit task
function editTask(e) {
    const taskItem = e.target.parentElement.parentElement;
    const taskTextElement = taskItem.querySelector('.task-text');
    
    const newTaskText = prompt('Edit task:', taskTextElement.textContent);
    if (newTaskText && newTaskText.trim() !== '') {
        taskTextElement.textContent = newTaskText.trim();

        // Update task in localStorage
        updateTaskInLocalStorage(taskTextElement.textContent);
    }
}

// Filter tasks based on button clicked
function filterTasks(e) {
    const filter = e.target.dataset.filter;
    filterButtons.forEach(button => button.classList.remove('active'));
    e.target.classList.add('active');

    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'pending':
                task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });
}

// Save task to localStorage
function saveTaskToLocalStorage(taskText, completed = false) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

// Update task status in localStorage
function updateTaskStatusInLocalStorage(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.text === taskText ? { text: taskText, completed } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task text in localStorage
function updateTaskInLocalStorage(updatedText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.text === updatedText ? { ...task, text: updatedText } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
