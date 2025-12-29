document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);

    const btnTask = $("btnTask");
    const btnFavorite = $("btnFavorite");
    const btnHistory = $("btnHistory");
    const btnAddTask = $("btnAddTask");

    const taskContent = $("taskContent");
    const favoriteContent = $("favoriteContent");
    const historyContent = $("historyContent");
    const addTaskContent = $("addTaskContent");

    const btnExitTask = $("btnExitTask");
    const btnExitFavorite = $("btnExitFavorite");
    const btnExitHistory = $("btnExitHistory");
    const btnExitAddTask = $("btnExitAddTask");

    const btnSaveTask = $("btnSaveTask");
    const taskInput = $("taskInput");

    const hideAll = () => {
        taskContent.classList.remove("show");
        favoriteContent.classList.remove("show");
        historyContent.classList.remove("show");
        addTaskContent.classList.remove("show");
    };

    const showOnly = which => {
        hideAll();
        if (which === "task") { taskContent.classList.add("show"); loadTasks(); }
        if (which === "favorite") { favoriteContent.classList.add("show"); loadFavoriteTasks(); }
        if (which === "history") { historyContent.classList.add("show"); loadHistory(); }
        if (which === "addTask") addTaskContent.classList.add("show");
    };

    btnTask.addEventListener("click", () => showOnly("task"));
    btnFavorite.addEventListener("click", () => showOnly("favorite"));
    btnHistory.addEventListener("click", () => showOnly("history"));
    btnAddTask.addEventListener("click", () => showOnly("addTask"));

    btnExitTask.addEventListener("click", hideAll);
    btnExitFavorite.addEventListener("click", hideAll);
    btnExitHistory.addEventListener("click", hideAll);
    btnExitAddTask.addEventListener("click", hideAll);

    // -------------------- Load Tasks --------------------
    async function loadTasks() {
        const res = await fetch("server.php");
        const tasks = await res.json();

        taskContent.innerHTML = `<button id="btnExitTask" class="close-btn">✕</button><h2>Task</h2>`;
        $("btnExitTask").addEventListener("click", hideAll);

        const listWrapper = document.createElement("div");
        listWrapper.style.marginTop = "10px";

        tasks.forEach(task => {
            const taskBox = document.createElement("div");
            taskBox.className = "task-item";

            const status = task.status || "pending";
            const isFavorited = task.is_favorited == 1;

            taskBox.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <button class="favorite-task" data-id="${task.id}" style="font-size:20px;">
                        ${isFavorited ? "💛" : "🤍"}
                    </button>
                    <span class="task-title">${task.title}</span>
                </div>
                <div>
                    <button class="toggle-status" data-id="${task.id}" data-status="${status}">
                        ${status === "done" ? "✅" : "❌"}
                    </button>
                    <button class="delete-task" data-id="${task.id}">🗑️</button>
                </div>
            `;

            listWrapper.appendChild(taskBox);
        });

        taskContent.appendChild(listWrapper);

        // Toggle status
        document.querySelectorAll(".toggle-status").forEach(btn => {
            btn.onclick = async () => {
                const id = Number(btn.dataset.id);
                const newStatus = btn.dataset.status === "done" ? "pending" : "done";
                await fetch("server.php", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, status: newStatus })
                });
                loadTasks(); loadFavoriteTasks(); loadHistory();
            };
        });

        // Delete task
        document.querySelectorAll(".delete-task").forEach(btn => {
            btn.onclick = async () => {
                if (!confirm("Delete this task?")) return;
                const id = Number(btn.dataset.id);
                await fetch("server.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });
                loadTasks(); loadFavoriteTasks(); loadHistory();
            };
        });

        // Favorite toggle
        document.querySelectorAll(".favorite-task").forEach(btn => {
            btn.onclick = async () => {
                const task_id = Number(btn.dataset.id);
                const r = await fetch("server.php?favorite=1", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task_id })
                });
                const data = await r.json();
                if (data.success) btn.textContent = data.favorited ? "💛" : "🤍";
                loadFavoriteTasks();
                loadHistory();
            };
        });
    }

    // -------------------- Load Favorite Tasks --------------------
    async function loadFavoriteTasks() {
        const res = await fetch("server.php");
        const tasks = await res.json();

        favoriteContent.innerHTML = `
            <button id="btnExitFavorite" class="close-btn">✕</button>
            <h2>Favorite Tasks</h2>
        `;
        $("btnExitFavorite").addEventListener("click", hideAll);

        const listWrapper = document.createElement("div");
        listWrapper.style.marginTop = "10px";

        const favTasks = tasks.filter(t => t.is_favorited == 1);

        if (favTasks.length === 0) {
            listWrapper.innerHTML = `<p style="text-align:center; color:#555;">No favorite tasks yet.</p>`;
        } else {
            favTasks.forEach(task => {
                const taskBox = document.createElement("div");
                taskBox.className = "task-item";
                const status = task.status || "pending";
                taskBox.innerHTML = `
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span class="task-title">${task.title}</span>
                    </div>
                    <div>
                        <button class="toggle-status" data-id="${task.id}" data-status="${status}">
                            ${status === "done" ? "✅" : "❌"}
                        </button>
                        <button class="delete-task" data-id="${task.id}">🗑️</button>
                    </div>
                `;
                listWrapper.appendChild(taskBox);
            });
        }

        favoriteContent.appendChild(listWrapper);

        document.querySelectorAll("#favoriteContent .toggle-status").forEach(btn => {
            btn.onclick = async () => {
                const id = Number(btn.dataset.id);
                const newStatus = btn.dataset.status === "done" ? "pending" : "done";
                await fetch("server.php", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, status: newStatus })
                });
                loadTasks(); loadFavoriteTasks(); loadHistory();
            };
        });

        document.querySelectorAll("#favoriteContent .delete-task").forEach(btn => {
            btn.onclick = async () => {
                if (!confirm("Delete this task?")) return;
                const id = Number(btn.dataset.id);
                await fetch("server.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });
                loadTasks(); loadFavoriteTasks(); loadHistory();
            };
        });
    }

    // -------------------- Save Task --------------------
    btnSaveTask.addEventListener("click", async () => {
        const title = taskInput.value.trim();
        if (!title) return alert("Enter a task!");
        await fetch("server.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });
        taskInput.value = "";
        showOnly("task");
        loadTasks();
        loadHistory();
    });

    // -------------------- Load History --------------------
    async function loadHistory() {
        const res = await fetch("history.php?nocache=" + Date.now());
        const logs = await res.json();

        historyContent.innerHTML = `<button id="btnExitHistory" class="close-btn">✕</button><h2>History</h2>`;
        $("btnExitHistory").addEventListener("click", hideAll);

        const ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.padding = "0";
        ul.style.marginTop = "10px";

        logs.forEach(log => {
    const li = document.createElement("li");
    let icon = "";
    const actionLower = log.action.toLowerCase();
    const status = log.status ? log.status.toLowerCase() : "pending";

    if (actionLower.includes("deleted")) icon = "🗑️";
    else if (actionLower.includes("added")) icon = "➕";
    else if (actionLower.includes("updated")) icon = status === "done" ? "✅" : "❌";
     else if (actionLower.includes("unfavorited")) icon = "🤍";  
    else if (actionLower.includes("favorited")) icon = "💛";    

    li.textContent = `[${log.timestamp}] ${log.action} — ${log.title} ${icon}`;
            li.style.marginBottom = "6px";
            li.style.padding = "6px";
            li.style.border = "1px solid #28a745";
            li.style.borderRadius = "6px";
            li.style.backgroundColor = "#e0f8e0";

            li.addEventListener("contextmenu", async e => {
                e.preventDefault();
                if (!confirm("Remove this history log?")) return;
                await fetch("history.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: log.id })
                });
                loadHistory();
            });

            ul.appendChild(li);
        });

        historyContent.appendChild(ul);
    }

    // -------------------- Initial Load --------------------
    loadTasks();
});
