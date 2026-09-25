<?php
// example of sending a utf-8 HTML mail:

$to = "ozhosting2016@gmail.com";
$subject = "Php Mail Test";
$message = "<b>Hi</b>, Hello, this is a php mail test. Please ignore.";
$headers = 'From: ozhosting2016@gmail.com\r\n' .
        'X-Mailer: PHP/' . phpversion() . "\r\n" .
        "MIME-Version: 1.0\r\n" .
        "Content-Type: text/html; charset=utf-8\r\n" .
        "Content-Transfer-Encoding: 8bit\r\n\r\n";

// Send
if(mail($to, $subject, $message, $headers)) {
echo ("An e-mail was sent to $to with the subject: $subject");
} else {
echo ("There was a problem sending the mail. Check your code and make sure that the e-mail address $to is valid");
}
?>