<?php
// auth.php
require 'vendor/autoload.php'; // تأكد من مسار مكتبة JWT

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

function verifyJWT($token) {
    $clerkSecret = 'sk_test_kzejrJYxiP2RHkiTlHIV7WGmnQIDrPzS4EspJL4qXg'; // استبدل بـ Backend API الخاص بك
    try {
        $decoded = JWT::decode($token, new Key($clerkSecret, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        return null;
    }
}

function getUserRole($userId, $conn) {
    // افترض إن عندك جدول users في قاعدة البيانات يحتوي على user_id و role
    $stmt = $conn->prepare("SELECT role FROM users WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc()) {
        return $row['role'];
    }
    return null;
}
?>