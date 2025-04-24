// Inicializar tareas desde localStorage al cargar la página
document.addEventListener("DOMContentLoaded", ()=>{
    const storedTasks = JSON.parse(localStorage.getItem('task'));

    if(storedTasks){
        task = storedTasks; //signo tarea al array global
        updateTasksList();
        updateStats();
    }
});

let task = []; //Array GLobal para almacenar tares

const saveTasks = () =>{
    localStorage.setItem('task', JSON.stringify(task))
};

//Agregar nueva tarea
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        task.push({ text: text, completed: false });
        taskInput.value = ""; // Limpia el input después de agregar la tarea
        updateTasksList(); 
        updateStats();
        saveTasks();
    }
};


//Alterna estado completed 
const toggleTaskComplete = (index) => {
    task[index].completed = !task[index].completed; // Alterna el estado de 'completed'
    updateTasksList();
    updateStats();
    saveTasks(); //Guardo cambios en el localStorage
};


//Elimina tarea
const deleteTask = (index) => {
    task.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

// Editar una tarea
const editTask = (index)=>{
    const taskInput = document.getElementById('taskInput');
    taskInput.value = task[index].text;

    task.splice(index, 1);
    updateTasksList();
    saveTasks();

};

// Actualizo
const updateStats = () =>{
    const completeTasks = task.filter(task => task.completed).length;
    const totalTasks = task.length
    const progress = totalTasks > 0 ? (completeTasks/totalTasks)* 100 : 0;
    const progressBar = document.getElementById('progress');

    if(progressBar){
        progressBar.style.width = `${progress}%`;
    }

    const numbers = document.getElementById("numbers");
    if(numbers){
        numbers.innerHTML = `${completeTasks} / ${totalTasks}`;
    } 

    // Lanzar confeti si todas las tareas están completadas
    if(task.length > 0 && completeTasks === totalTasks){
        blaskConfetti();
    }
}

document.getElementById("newTask").addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

// Actualizar la lista de tareas en pantalla
const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    if(!taskList){
        console.error("EL elemento con el ID 'task-list' no existe en el DOM.")
        return;
    }
    taskList.innerHTML=""; // Limpia la lista antes de actualizar

    task.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" ${task.completed ? 'checked' : ''} />
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="img/note-task-edit.png" alt="edit icon" onClick="editTask(${index})"/>
                <img src="img/trash.png" alt="delete icon" onClick="deleteTask(${index})"/>
            </div>
        </div>
        `;

        // Evento para alternar el estado completado
        listItem.querySelector('input[type="checkbox"]').addEventListener("change", () => {
            toggleTaskComplete(index);
        });

        taskList.append(listItem); // Agrega el elemento a la lista
    });
};

const blaskConfetti = () => {
    const duration = 15 * 1000; // Duración total en milisegundos (15 segundos)
    const animationEnd = Date.now() + duration;

    // Función para generar valores aleatorios en un rango
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval); // Detiene el intervalo cuando el tiempo termina
            return;
        }

        const particleCount = 50 * (timeLeft / duration); // Cantidad proporcional de partículas

        // Llamada al método `confetti` de la biblioteca tsParticles
        confetti({
            angle: randomInRange(55, 125), // Ángulo aleatorio para un efecto más dinámico
            spread: randomInRange(50, 70), // Dispersión en grados
            startVelocity: 30, // Velocidad inicial
            particleCount: Math.ceil(particleCount), // Redondea la cantidad de partículas
            origin: { 
                x: randomInRange(0.1, 0.9), // Origen horizontal dinámico
                y: randomInRange(0.2, 0.8)  // Origen vertical dinámico
            },
            colors: ['#ff0', '#0f0', '#00f', '#f0f'], // Colores personalizados
        });
    }, 250); // Llama a confetti cada 250ms
};