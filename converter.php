<?php

$xls = file_get_contents("HistoricalData.csv");

$rows = explode(PHP_EOL, $xls);

$arr = ["rates" => []];

foreach($rows as $row){
    $cells = explode(",", $row);

    $arr["rates"][$cells[0]] = [
        "CAD" => $cells[1]
    ];
}

echo json_encode($arr);