<?
header("Content-Type: text/html; charset=utf-8");

$ANSWER_REVIEW = 'Сообщение отправлено, спасибо за ваш отзыв!';
$ANSWER_RESERVATION = 'Спасибо, мы вам перезвоним!';
$SUBJECT_REVIEW = 'отзыв';
$SUBJECT_ORDER_RESERVATION = 'подтверждение заказа';
$SUBJECT_HALL_RESERVATION = 'бронирование банкетного зала';
$ERROR = 'Извините, сообщение не отправлено — техническая неполадка';
$EMPTY_BODY = 'Введите текст';

$event = $_REQUEST['event'];
$body = $_REQUEST['formBody'];

$to = 'ivangerasimow@gmail.com';

switch ($event) {
  case 'SendReview':
    $answer = $ANSWER_REVIEW;
    $subject = '«Сундучок игрушек», '.$SUBJECT_REVIEW;
    // $body = $_REQUEST['formBody'];
    break;
  case 'sendOrderReservation':
    $answer = $ANSWER_RESERVATION;
    $subject = '«Сундучок игрушек», '.$SUBJECT_ORDER_RESERVATION;
    // $body = $_REQUEST['message'];
    break;
  case 'SendHallReservation':
    $answer = $ANSWER_RESERVATION;
    $subject = '«Сундучок игрушек», '.$SUBJECT_HALL_RESERVATION;
    // $body = $_REQUEST['message'];
    break;
  default:
    $answer = 'empty';
    $subject = '«Сундучок игрушек»';
    break;
}

if ($body != ''){
	if (mail ($to, $subject, $body)){
		echo $answer;
	}
	else {
		echo $ERROR;
	}
} else {
    echo $EMPTY_BODY;
  }
?>