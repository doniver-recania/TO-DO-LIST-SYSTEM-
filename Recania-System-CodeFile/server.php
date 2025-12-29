<?php
header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// -------------------- Add Task --------------------
if ($method === "POST" && !isset($_GET['favorite'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $title = trim($data['title']);
    if (!$title) { echo json_encode(["success"=>false,"error"=>"Empty title"]); exit; }

    $titleEsc = $conn->real_escape_string($title);
    if ($conn->query("INSERT INTO tasks (title) VALUES ('$titleEsc')")) {
        $task_id = $conn->insert_id;
        $conn->query("INSERT INTO history (task_id, action, status, title) 
                      VALUES ($task_id, 'Added task', 'pending', '$titleEsc')");
        echo json_encode(["success"=>true,"id"=>$task_id]);
    } else {
        echo json_encode(["success"=>false,"error"=>$conn->error]);
    }
    exit;
}

// -------------------- Get Tasks --------------------
if ($method === "GET") {
    $res = $conn->query("
        SELECT t.*, 
               CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_favorited
        FROM tasks t
        LEFT JOIN favorites f ON t.id = f.task_id
        ORDER BY t.id DESC
    ");
    $tasks = [];
    while ($row = $res->fetch_assoc()) { $tasks[] = $row; }
    echo json_encode($tasks);
    exit;
}

// -------------------- Update Task Status --------------------
if ($method === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = (int)$data['id'];
    $status = isset($data['status']) ? $conn->real_escape_string($data['status']) : null;
    if (!$status) { echo json_encode(["success"=>false,"error"=>"No status provided"]); exit; }

    $taskRes = $conn->query("SELECT title FROM tasks WHERE id=$id");
    $taskRow = $taskRes->fetch_assoc();
    $title = $taskRow['title'] ?? '(deleted task)';

    if ($conn->query("UPDATE tasks SET status='$status' WHERE id=$id")) {
        $conn->query("INSERT INTO history (task_id, action, status, title)
                      VALUES ($id, 'Updated task', '$status', '".$conn->real_escape_string($title)."')");
        echo json_encode(["success"=>true]);
    } else {
        echo json_encode(["success"=>false,"error"=>$conn->error]);
    }
    exit;
}

// -------------------- Delete Task --------------------
if ($method === "DELETE" && !isset($_GET['favorite'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = (int)$data['id'];

    // 1. Get task details before deleting
    $taskRes = $conn->query("SELECT title, status FROM tasks WHERE id=$id");
    $taskRow = $taskRes->fetch_assoc();
    $title = $taskRow['title'] ?? '(deleted task)';
    $status = $taskRow['status'] ?? 'pending';

    // 2. Insert into history
    $conn->query("INSERT INTO history (task_id, action, status, title) 
                  VALUES ($id, 'Deleted task', '$status', '".$conn->real_escape_string($title)."')");

    // 3. Delete the task
    $conn->query("DELETE FROM tasks WHERE id=$id");

    echo json_encode(["success"=>true]);
    exit;
}

// -------------------- Toggle Favorite --------------------
if ($method === "POST" && isset($_GET['favorite'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $task_id = (int)$data['task_id'];

    $res = $conn->query("SELECT id FROM favorites WHERE task_id=$task_id");
    $taskTitleRes = $conn->query("SELECT title FROM tasks WHERE id=$task_id");
    $taskTitleRow = $taskTitleRes->fetch_assoc();
    $title = $taskTitleRow['title'] ?? '(deleted task)';

    if ($res->num_rows > 0) {
        // Unfavorite
        $conn->query("DELETE FROM favorites WHERE task_id=$task_id");
        $conn->query("INSERT INTO history (task_id, action, title) 
                      VALUES ($task_id, 'Unfavorited task', '".$conn->real_escape_string($title)."')");
        echo json_encode(["success"=>true, "favorited"=>false]);
    } else {
        // Favorite
        $conn->query("INSERT INTO favorites (task_id) VALUES ($task_id)");
        $conn->query("INSERT INTO history (task_id, action, title) 
                      VALUES ($task_id, 'Favorited task', '".$conn->real_escape_string($title)."')");
        echo json_encode(["success"=>true, "favorited"=>true]);
    }
    exit;
}

$conn->close();
?>
