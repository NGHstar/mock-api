<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input['cart']) || !is_array($input['cart'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request format"]);
    exit;
}

$orderId = uniqid(); // ایجاد شناسه یونیک برای سفارش
$orderTime = date('c'); // فرمت استاندارد ISO 8601 برای تاریخ
$estimatedDelivery = date('c', strtotime('+2 days')); // تحویل دو روز بعد
$total = 5800; // مقدار ثابت برای total

$products = [];
foreach ($input['cart'] as $item) {
    $products[] = [
        "productId" => $item["productId"],
        "quantity" => $item["quantity"],
        "estimatedDeliveryTime" => $estimatedDelivery
    ];
}

$response = [
    "id" => $orderId,
    "orderTime" => $orderTime,
    "total" => $total,
    "products" => $products
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit;
