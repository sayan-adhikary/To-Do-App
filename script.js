//element selection'
let input = document.querySelector('input');
let addBtn = document.querySelector('#btn');
let taskList = document.querySelector('#task-list');
let clearBtn = document.querySelector('#clear-completed');

//creating dataStructure
let tasks = [];

//create a archive datastructure
let archivedTasks = [];

// tasks = [
//     "sayan",
//     "aiv",
//     "shreya",
//     "susmita"
// ]

// console.log(input);
// console.log(addBtn);
// console.log(taskList);
// console.log(tasks);


//adding event with add btn
addBtn.addEventListener('click', () => {
    let task = input.value;
    task = task.trim();
    if (task == "") {
        return;
    }
    let taskObj = {
        id: Date.now(), //Can I use => crypto.randomUUID();
        text: task,
        completed: false
    }
    tasks.push(taskObj);
    updateTaskCount();  //to count the tasks
    input.value = "";
    saveTasks();

    createTask(taskObj);
    renderTasks();  //re arrenge and display
})

//Adding a single eventListiner to the taskList [Event Delegation]
taskList.addEventListener('click', (e) => {

    //Delete Functionality
    if (e.target.classList.contains('delete-btn')) {
        // console.log("Delete btn pressed");

        //finding the task Div[entire row] & delete from UI and array also
        let taskDiv = e.target.parentElement;
        let id = Number(taskDiv.dataset.id);    //dataset -> set data-id in dom
        taskDiv.remove();
        // console.log(id);

        //remove from the array
        tasks = tasks.filter(task => task.id !== id);
        updateTaskCount();  //task counter
        saveTasks();    //save to localStorage
        renderTasks();  //reArrenge the tasks
    }

    //CheckBox Functionality
    if (e.target.classList.contains("check-box")) {
        // console.log("Checkbox Clicked");

        //target id check
        let taskDiv = e.target.parentElement;
        let id = Number(taskDiv.dataset.id);

        //select span
        let span = taskDiv.querySelector('span');

        //if false make it true & vice versa
        for (let task of tasks) {
            if (task.id === id) {
                task.completed = !task.completed;
                saveTasks();    //save to localStorage

                //changing the style
                if (task.completed) {
                    span.style.textDecoration = 'line-through';
                } else {
                    span.style.textDecoration = 'none';
                }
            }
        }
        //after check the box we will calculate
        updateTaskCount();
        renderTasks();  //reArrange the tasks
    }

    //Edit Functionality
    if (e.target.classList.contains('edit-btn')) {
        // console.log("Edit Clicked");
        /*
        1. User clicks Edit.(done)
        2. Task text moves into the input box.
        3. Original task is removed from the array.
        4. User modifies the text.
        5. User clicks Add.
        6. A new updated task is created.
         */

        let taskDiv = e.target.parentElement;
        let id = Number(taskDiv.dataset.id);
        let text = taskDiv.querySelector('span').textContent;
        //2
        input.value = text;
        //3
        taskDiv.remove();
        //4, 5 working automatically with add event
        //filtering the array
        tasks = tasks.filter(task => task.id !== id);
        updateTaskCount();  //Task counter
        //save into the array
        saveTasks();
        renderTasks();  //reArrange the tasks
    }
})

//create a function to store the data in localStorage and to call everywhere
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));
}

//Creating a loadTask function which will load the task from localStorage at the starting
function loadData() {
    let savedTasks = localStorage.getItem("tasks");
    let savedArchiveTasks = localStorage.getItem("archivedTasks");

    //Convert JSON Back to Array - tasks
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    //Convert JSON Back to Array - archivedTasks
    if (savedArchiveTasks) {
        archivedTasks = JSON.parse(savedArchiveTasks);
    }


    for (let task of tasks) {
        let taskDiv = createTask(task);
        // taskList.appendChild(taskDiv);
    }

    renderTasks();  //reArrange the tasks
}

//call the function [If we will not click anything the loadData function will call first]
loadData();
//load the task count after knowing and creating inside the the local Storage
updateTaskCount();

//creating the Div and adding task 
function createTask(taskObj) {
    //1. creating div and add it at the end
    let taskDiv = document.createElement('div');
    taskDiv.dataset.id = taskObj.id;    //Attach the ID to the DOM
    //2. checkbox
    let checkBox = document.createElement('input');
    checkBox.classList.add("check-box");
    checkBox.type = 'checkbox';
    checkBox.checked = !!taskObj.completed;
    //3. task text
    let span = document.createElement('span');
    span.textContent = taskObj.text;
    if (taskObj.completed) span.style.textDecoration = 'line-through';
    //4. edit btn
    let editBtn = document.createElement('button');
    editBtn.classList.add("edit-btn");
    editBtn.textContent = 'Edit';
    //5.delete btn
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = 'Delete';

    //Add everything inside the task div
    taskDiv.appendChild(checkBox);
    taskDiv.appendChild(span);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(deleteBtn);

    //finally append to taskList
    taskList.appendChild(taskDiv);

    return taskDiv;
}

//Counter Function (Done)
function updateTaskCount() {
    let count = document.querySelector("#task-count");
    let completed = tasks.filter(tasks => tasks.completed).length;
    let pending = tasks.length - completed;
    count.textContent = `Total Tasks: ${tasks.length} || Completed Tasks : ${completed} || Pending : ${pending}`;
}

//Clear Completed Tasks If I want
clearBtn.addEventListener('click', () => {
    // console.log("clearBtn");
    let completedTasks = tasks.filter(tasks => tasks.completed);
    archivedTasks.push(...completedTasks);
    tasks = tasks.filter(tasks => !tasks.completed);
    // updateTaskCount();
    saveTasks();
    renderTasks();
})

// creating a function which will create display the complete tasks
function renderTasks() {
    taskList.innerHTML = "";

    for (let task of tasks) {
        taskList.appendChild(createTask(task));
    }
    updateTaskCount();
}