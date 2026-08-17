// ================================
// SELECT HTML ELEMENTS
// ================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const clearAllBtn = document.getElementById("clearAllBtn");


// ================================
// LOAD TASKS FROM LOCAL STORAGE
// ================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ================================
// SAVE TASKS TO LOCAL STORAGE
// ================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ================================
// ADD TASK
// ================================

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    const task = {

        id: Date.now(),

        title: taskText,

        completed: false

    };


    tasks.push(task);


    // Save updated tasks
    saveTasks();


    taskInput.value = "";


    renderTasks();
}


// ================================
// DISPLAY TASKS
// ================================

function renderTasks() {

    taskList.innerHTML = "";


    tasks.forEach(function(task) {

        const li = document.createElement("li");


        li.className = `
            bg-white
            p-4
            rounded-xl
            shadow-sm
            flex
            items-center
            justify-between
            gap-4
        `;


        li.innerHTML = `

            <div class="flex items-center gap-3">

                <input
                    type="checkbox"
                    class="complete-checkbox w-5 h-5"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <span
                    class="
                        task-title
                        ${task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }
                    "
                >
                    ${task.title}
                </span>

            </div>


            <div class="flex gap-2">

                <button
                    class="
                        edit-btn
                        px-3
                        py-2
                        text-sm
                        bg-gray-200
                        rounded-lg
                        hover:bg-gray-300
                    "
                    data-id="${task.id}"
                >
                    Edit
                </button>


                <button
                    class="
                        delete-btn
                        px-3
                        py-2
                        text-sm
                        bg-red-500
                        text-white
                        rounded-lg
                        hover:bg-red-600
                    "
                    data-id="${task.id}"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    updateStats();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    // Save after deleting
    saveTasks();


    renderTasks();
}


// ================================
// COMPLETE / UNCOMPLETE TASK
// ================================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    // Save after completing
    saveTasks();


    renderTasks();
}


// ================================
// EDIT TASK
// ================================

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const newTitle = prompt(
        "Edit your task:",
        task.title
    );


    if (newTitle === null) {
        return;
    }


    const trimmedTitle = newTitle.trim();


    if (trimmedTitle === "") {

        alert("Task cannot be empty.");

        return;
    }


    task.title = trimmedTitle;


    // Save after editing
    saveTasks();


    renderTasks();
}


// ================================
// UPDATE STATISTICS
// ================================

function updateStats() {

    const total = tasks.length;


    const completed = tasks.filter(function(task) {

        return task.completed === true;

    }).length;


    const pending = total - completed;


    totalTasks.textContent = total;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;
}


// ================================
// ADD BUTTON
// ================================

addTaskBtn.addEventListener("click", function() {

    addTask();

});


// ================================
// ENTER KEY
// ================================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ================================
// EDIT / DELETE
// ================================

taskList.addEventListener("click", function(event) {

    const id = Number(event.target.dataset.id);


    if (event.target.classList.contains("delete-btn")) {

        deleteTask(id);

    }


    if (event.target.classList.contains("edit-btn")) {

        editTask(id);

    }

});


// ================================
// CHECKBOX
// ================================

taskList.addEventListener("change", function(event) {

    if (
        event.target.classList.contains(
            "complete-checkbox"
        )
    ) {

        const id = Number(
            event.target.dataset.id
        );


        toggleTask(id);

    }

});


// ================================
// CLEAR ALL
// ================================

clearAllBtn.addEventListener("click", function() {

    if (tasks.length === 0) {

        return;
    }


    const confirmClear = confirm(
        "Are you sure you want to delete all tasks?"
    );


    if (confirmClear) {

        tasks = [];


        // Remove from localStorage
        localStorage.removeItem("tasks");


        renderTasks();

    }

});


// ================================
// INITIAL RENDER
// ================================

renderTasks();