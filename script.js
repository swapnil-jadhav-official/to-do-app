const toDoList = (function(){
        var tasks = [];
        const input = document.querySelector(".add-task");
        const taskList = document.getElementById("list");

        // Three Counters: Total | Pending | Completed
        const taskCounter = document.getElementById("total-tasks");
        const pendingCounter = document.getElementById("pending-tasks");
        const completeCounter = document.getElementById("completed-tasks");
        let pending = 0,complete = 0;
        
        // Notification
        const notify = document.getElementById("snack-bar");

        //Empty task list
        function showEmpty(){
            taskList.innerHTML = '';
            let listElement = document.createElement('li');
            let newHtml = ``;
            newHtml += `You Dont have any task here`;
            
            listElement.innerHTML = newHtml;
            taskList.append(listElement);
        }
        
        // Add Tasks to DOM
        function addToDOM(task){
            let listElement = document.createElement('li');
            let newHtml = ``;
            newHtml += `<input type="checkbox" id="${task.id}" ${task.completed ? "checked" : ""} class="custom-checkbox">`;
            newHtml += `<label for="${task.id}">${task.title}</label>`;
            newHtml += `<img src="images/cross.png" class="delete" data-id="${task.id}" />`;
    
            listElement.innerHTML = newHtml;
            taskList.append(listElement);
            
            return;
        }
        //Update counts of Pending and Completed
        function updateCount(){
            complete = 0;
            pending = 0;
            for(let task of tasks){
                // console.log("status : "+task.completed)
                if(task.completed) complete++;
                else pending++;
            }
            console.log(complete+" "+pending);
        }
        // Set status of all tasks to completed
        function setToComplete(){
            for(task of tasks){
                task.completed = true;
            }
            updateCount();
        }
        // Render All Tasks present
        function renderList(taskCategory){
            updateCount();
            
            taskList.innerHTML = '';
           
            if(tasks.length === 0){
                showEmpty();
                return;
            }
            //taskCategory === '' || 
            if(taskCategory === 'all'){
                for(let singleTask of tasks){
                    addToDOM(singleTask);
                }
            }else if(taskCategory === 'pending'){
                for(let singleTask of tasks){
                    if(singleTask.completed == false) addToDOM(singleTask);
                }
            }else if(taskCategory === 'complete'){
                for(let singleTask of tasks){
                    if(singleTask.completed == true) addToDOM(singleTask);
                }
            }else if(taskCategory === 'clear'){
                tasks = [];
                pending = 0;
                complete = 0;
                showEmpty();
            }else if(taskCategory === 'completeAll'){
                setToComplete();
                for(let singleTask of tasks){
                    addToDOM(singleTask);
                }
            }
            // for(let singleTask of tasks){
            //     if(!singleTask.completed) addToDOM(singleTask);
            // }
            taskCounter.innerHTML = `Total tasks: ${tasks.length}`
            pendingCounter.innerHTML = `Pending: ${pending}`
            completeCounter.innerHTML = `Complete: ${complete}`
            return;
        }
        // Toggle Task to Completed or Incomplete
        function toggleTask(taskId){
                for(let task of tasks){
                    if(task.id === Number(taskId)){
                        // if(task.completed){
                        //     pending += 1;
                        //     if(complete != 0) complete -= 1;
                        // }else{
                        //     if(pending != 0) pending -= 1;
                        //     complete += 1;
                        // }
                        task.completed = !task.completed;
                        console.log(tasks)
                        updateCount();
                        renderList('all');
                        return;
                    }
                }
                showNotification("Could not toggled task");
                return;
        }
        // Delete Task
        function deleteTask(taskId){
            var newTasks = tasks.filter((task) => task.id !== Number(taskId));
            tasks = newTasks;
            updateCount();
            renderList('all');
            // console.log(tasks.length);
            taskCounter.innerHTML = `Total tasks: ${tasks.length}`
            return;
        }
        // Add Task 
        function addTask(task){
            if(!task){
                showNotification("Task Cannot be added");
                return;
            }
            // fetch('https://jsonplaceholder.typicode.com/todos',{
            //         method: 'POST', // *GET, POST, PUT, DELETE, etc.
            //         headers: {
            //             'Content-Type': 'application/json'
            //             // 'Content-Type': 'application/x-www-form-urlencoded',
            //         },
            //         body: JSON.stringify(task)
            //     })
            //     .then(function (response){
            //         return response.json();
            //     })
            //     .then(function (data){
                
            //         tasks.push(task);
            //         showNotification("Task added");
            //         renderList();
            //         taskCounter.innerHTML = `Total tasks: ${tasks.length}`
            //         // renderList();
            //     })
            //     .catch(function (error){
            //         showNotification(error);
            //     })
            tasks.push(task);
            console.log(tasks);
            showNotification("Task added");
            // pending += 1;
            updateCount();
            renderList('all');
            taskCounter.innerHTML = `Total tasks: ${tasks.length}`
            return;
        }
        // Show Notification
        function showNotification(msg){
            notify.innerHTML = msg;
            notify.classList.add("show");
            setTimeout(function(){
                notify.classList.remove("show");
                notify.classList.add("blank");
            },1500);
            // alert(msg);
        }
        // Enter Key Event Listener
        function getTask(e){
            console.log(e.key)
            if(e.key === 'Enter'){
                const userInput = e.target.value;
                input.value = "";

                if(!userInput){
                    showNotification("Task Empty..");
                    return;
                }

                const task = {
                    title : userInput,
                    id: Date.now(),
                    completed: false,
                }

                addTask(task);
                
            }
        }
        // Event Deligation (All Event listeners on screen)
        function allEvents(e){
            const target = e.target;
            // console.log(target);
        
            if(target.className === 'delete'){
                const taskId = target.dataset.id;
                console.log(target.dataset);
                deleteTask(taskId);
                showNotification("Task deleted");
            }else if(target.className === 'custom-checkbox'){
               
                const taskId = target.id;
                toggleTask(taskId);
                showNotification("Toggled successfully")
            }
            if(target.className === 'action all'){
                // console.log("all clicked")
                renderList('all');
            }
            if(target.className === 'action pending'){
                // console.log("Pending clicked")
                renderList('pending');
            }
            if(target.className === 'action complete'){
                // console.log("Complete clicked")
                renderList('complete');
            }
            if(target.className === 'action clear'){
                // console.log("Clear clicked")
                renderList('clear');
            }
            if(target.className === 'action completeAll'){
                // console.log("Clear clicked")
                renderList('completeAll');
            }
            if(target.id === "add-button"){
                const userInput = input.value;
                input.value = "";

                if(!userInput){
                    showNotification("Task Empty..");
                    return;
                }

                const task = {
                    title : userInput,
                    id: Date.now(),
                    completed: false,
                }

                addTask(task);
            }
            
        
        
        
        }
        // initiallizeApp();
        function initiallizeApp(){
            // fetchToDos();
            showEmpty();
            input.addEventListener("keyup",getTask);
            document.addEventListener("click",allEvents);
        }
        return {
            initiallize: initiallizeApp,
        }
})();