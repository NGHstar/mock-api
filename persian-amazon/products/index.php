<?php
header("Access-Control-Allow-Origin: *"); // اجازه دسترسی به همه دامنه ها (CORS)
header("Content-Type: application/json; charset=UTF-8"); // تنظیم نوع محتوا

$jsonFile = "products.json"; // مسیر فایل JSON

if (file_exists($jsonFile)) {
    echo file_get_contents($jsonFile); // خواندن و نمایش محتوای JSON
} else {
    http_response_code(404); // ارسال خطای 404 در صورت نبود فایل
    echo json_encode(["error" => "File not found"]);
}
?>
