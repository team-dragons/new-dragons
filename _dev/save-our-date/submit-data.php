<?php
    header("Expires:Mon, 31 Dec 2010 05:00:00 GMT");

    include '/home/163663/domains/zena-and-warren.com/html/includes/database-connection.php';

    $srvr_remote_addr = $_SERVER['REMOTE_ADDR'];
    $srvr_http_user_agent = $_SERVER['HTTP_USER_AGENT'];
    $srvr_http_referer = $_SERVER['HTTP_REFERER'];
    $srvr_query_string = $_SERVER['QUERY_STRING'];

    ini_set('sendmail_from', 'warren.shea@gmail.com');
    date_default_timezone_set("America/Toronto");

    $form_name = filter_input(INPUT_GET, "name", FILTER_SANITIZE_SPECIAL_CHARS);
    $form_address = filter_input(INPUT_GET, "address", FILTER_SANITIZE_SPECIAL_CHARS);
    $form_city = filter_input(INPUT_GET, "city", FILTER_SANITIZE_SPECIAL_CHARS);
    $form_province = filter_input(INPUT_GET, "province", FILTER_SANITIZE_SPECIAL_CHARS);
    $form_postalCode = filter_input(INPUT_GET, "postalCode", FILTER_SANITIZE_SPECIAL_CHARS);
    $form_optional = filter_input(INPUT_GET, "optional", FILTER_SANITIZE_SPECIAL_CHARS);

    $statement = "INSERT INTO guestAddress(guestName,guestAddress,guestCity,guestProvince,guestPostalCode,guestOptional,submit_time) VALUES (:guestName,:guestAddress,:guestCity,:guestProvince,:guestPostalCode,:guestOptional,DATE_ADD(NOW(), INTERVAL 1 HOUR))";
    $query = $pdo->prepare($statement);
    try {
      $query->execute(array(
          ':guestName' => $form_name,
          ':guestAddress' => $form_address,
          ':guestCity' => $form_city,
          ':guestProvince' => $form_province,
          ':guestPostalCode' => $form_postalCode,
          ':guestOptional' => $form_optional
      ));
    } catch (PDOException $e) {
      print "An error prevented this operation from being executed.";
    }

    $to = "warren.shea@gmail.com,zena.jun@gmail.com";
    $subject = "Wedding - Guest Address - " . $form_name;
    $msg =  "<table style='font-size: 12px;font-family: courier new;'><tr><td><strong>" .
    "Name</strong></td><td>: " . $form_name . "</td></tr><tr><td><strong>" .
    "Address</strong></td><td>: " . $form_address . "</td></tr><tr><td><strong>" .
    "City</strong></td><td>: " . $form_city . "</td></tr><tr><td><strong>" .
    "Province</strong></td><td>: " . $form_province . "</td></tr><tr><td><strong>" .
    "Postal Code </strong></td><td>: " . $form_postalCode . "</td></tr><tr><td><strong>" .
    "Optional Message </strong></td><td>: " . $form_optional . "</td></tr><tr><td><strong>" .
    "Time</strong></td><td>: " . date("h:i:s a") . "</td></tr>" .
    "</table>";
    $headers = "Content-type: text/html;";
    $headers .= 'From: warren.shea@gmail.com';
    //$config = "warren.shea@gmail.com";
    mail("$to", "$subject", "$msg", "$headers");
?>