<?php
header("Content-Type: application/json");
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    $res = $conn->query("SELECT * FROM history ORDER BY timestamp DESC");
    $history = [];
    while ($row = $res->fetch_assoc()) { $history[] = $row; }
    echo json_encode($history);
    exit;
}

// Optional: user can delete a single log manually
if ($method === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = (int)$data['id'];
    $conn->query("DELETE FROM history WHERE id=$id");
    echo json_encode(["success"=>true]);
    exit;
}

$conn->close();
?>
