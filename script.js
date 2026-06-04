//element selection'
let input = document.querySelector('input');
let addBtn = document.querySelector('#btn');
let taskList = document.querySelector('#task-list');

//creating dataStructure
let tasks = [];

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
        id: Date.now(),
        text: task,
        completed: false
    }
    tasks.push(taskObj);
    input.value = "";
    saveTasks();

    createTask(taskObj);
})

//Adding a single eventListiner to the taskList [Event Delegation]
taskList.addEventListener('click', (e) => {

    //Delete functionality
    if (e.target.classList.contains('delete-btn')) {
        // console.log("Delete btn pressed");

        //finding the task Div[entire row] & delete from UI and array also
        let taskDiv = e.target.parentElement;
        let id = Number(taskDiv.dataset.id);    //dataset -> set data-id in dom
        taskDiv.remove();
        // console.log(id);

        //remove from the array
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();    //save to localStorage
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
    }
})

//create a function to store the data in localStorage and call everywhere
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Creating a loadTask function which will load the task from local Sarver
function loadData() {
    let savedTasks = localStorage.getItem("tasks");

    //Convert JSON Back to Array
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    for (let task of tasks) {
        let taskDiv = createTask(task);
        // taskList.appendChild(taskDiv);
    }
}

loadData();

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