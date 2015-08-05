<?php
  header('Content-Type: text/html; charset=utf-8');
  // $message = $_REQUEST['message'];
  // $id = $_POST['json'];
  // if (strlen($message) == 0) {
  //   echo 'error::empty';
  //   exit;
  // }

  // $newItems = explode(',', $_REQUEST['message']);

  $newItems = $_POST['json'];

  $catalogue_filePath = '../json/items.json';
  // $calendar = json_decode(file_get_contents($catalogue_filePath));

  // foreach ($newItems as $item) {
  //   $calendar[] = $item;
  // }

  $fp = fopen($catalogue_filePath, 'w');
  flock ($fp, LOCK_EX);
  // For php >5.4.0
  // fwrite($fp, json_encode($newItems, JSON_UNESCAPED_UNICODE));
  // For Denwer
  fwrite($fp, json_encode($newItems,)); 
  flock($fp, LOCK_UN);
  fclose($fp);
  echo 'Выполнено';
?>