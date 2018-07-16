<?php
    header("Expires:Mon, 31 Dec 2010 05:00:00 GMT");

    include '/home/163663/domains/zena-and-warren.com/html/includes/database-connection.php';

    $srvr_remote_addr = $_SERVER['REMOTE_ADDR'];
    $srvr_http_user_agent = $_SERVER['HTTP_USER_AGENT'];
    $srvr_http_referer = $_SERVER['HTTP_REFERER'];
    $srvr_query_string = $_SERVER['QUERY_STRING'];

    ini_set('sendmail_from', 'warren.shea@gmail.com');
    date_default_timezone_set("America/Toronto");

    $guest1FirstName = filter_input(INPUT_GET, "guest1FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest1LastName = filter_input(INPUT_GET, "guest1LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest1Meal = filter_input(INPUT_GET, "guest1Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $attendance = filter_input(INPUT_GET, "attendance", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest2FirstName = filter_input(INPUT_GET, "guest2FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest2LastName = filter_input(INPUT_GET, "guest2LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest2Meal = filter_input(INPUT_GET, "guest2Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest3FirstName = filter_input(INPUT_GET, "guest3FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest3LastName = filter_input(INPUT_GET, "guest3LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest3Meal = filter_input(INPUT_GET, "guest3Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest4FirstName = filter_input(INPUT_GET, "guest4FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest4LastName = filter_input(INPUT_GET, "guest4LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest4Meal = filter_input(INPUT_GET, "guest4Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest5FirstName = filter_input(INPUT_GET, "guest5FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest5LastName = filter_input(INPUT_GET, "guest5LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest5Meal = filter_input(INPUT_GET, "guest5Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $highchairs = filter_input(INPUT_GET, "highchairs", FILTER_SANITIZE_SPECIAL_CHARS);
    $guestsDietaryRestrictions = filter_input(INPUT_GET, "guestsDietaryRestrictions", FILTER_SANITIZE_SPECIAL_CHARS);
    $optionalMessage = filter_input(INPUT_GET, "optionalMessage", FILTER_SANITIZE_SPECIAL_CHARS);

    $statement = "INSERT INTO guestRSVP(guest1FirstName,guest1LastName,guest1Meal,attendance,guest2FirstName,guest2LastName,guest2Meal,guest3FirstName,guest3LastName,guest3Meal,guest4FirstName,guest4LastName,guest4Meal,guest5FirstName,guest5LastName,guest5Meal,highchairs,guestsDietaryRestrictions,optionalMessage,submit_time) VALUES (:guest1FirstName,:guest1LastName,:guest1Meal,:attendance,:guest2FirstName,:guest2LastName,:guest2Meal,:guest3FirstName,:guest3LastName,:guest3Meal,:guest4FirstName,:guest4LastName,:guest4Meal,:guest5FirstName,:guest5LastName,:guest5Meal,:highchairs,:guestsDietaryRestrictions,:optionalMessage,DATE_ADD(NOW(), INTERVAL 1 HOUR))";
    $query = $pdo->prepare($statement);
    try {
      $query->execute(array(
        ':$guest1FirstName' => $guest1FirstName,
        ':$guest1LastName' => $guest1LastName,
        ':$guest1Meal' => $guest1Meal,
        ':$attendance' => $attendance,
        ':$guest2FirstName' => $guest2FirstName,
        ':$guest2LastName' => $guest2LastName,
        ':$guest2Meal' => $guest2Meal,
        ':$guest3FirstName' => $guest3FirstName,
        ':$guest3LastName' => $guest3LastName,
        ':$guest3Meal' => $guest3Meal,
        ':$guest4FirstName' => $guest4FirstName,
        ':$guest4LastName' => $guest4LastName,
        ':$guest4Meal' => $guest4Meal,
        ':$guest5FirstName' => $guest5FirstName,
        ':$guest5LastName' => $guest5LastName,
        ':$guest5Meal' => $guest5Meal,
        ':$highchairs' => $highchairs,
        ':$guestsDietaryRestrictions' => $guestsDietaryRestrictions,
        ':$optionalMessage' => $optionalMessage
      ));
    } catch (PDOException $e) {
      print "An error prevented this operation from being executed.";
    }
    
    $to = "warren.shea@gmail.com,zena.jun@gmail.com";
    $subject = "Wedding - RSVP - " . $form_name;
    $msg =  "<table style='font-size: 12px;font-family: courier new;'><tr><td><strong>" .
        "guest1FirstName</strong></td><td>: " . $guest1FirstName . "</td></tr><tr><td><strong>" .
        "guest1LastName</strong></td><td>: " . $guest1LastName . "</td></tr><tr><td><strong>" .
        "guest1Meal</strong></td><td>: " . $guest1Meal . "</td></tr><tr><td><strong>" .
        "attendance</strong></td><td>: " . $attendance . "</td></tr><tr><td><strong>" .
        "guest2FirstName</strong></td><td>: " . $guest2FirstName . "</td></tr><tr><td><strong>" .
        "guest2LastName</strong></td><td>: " . $guest2LastName . "</td></tr><tr><td><strong>" .
        "guest2Meal</strong></td><td>: " . $guest2Meal . "</td></tr><tr><td><strong>" .
        "guest3FirstName</strong></td><td>: " . $guest3FirstName . "</td></tr><tr><td><strong>" .
        "guest3LastName</strong></td><td>: " . $guest3LastName . "</td></tr><tr><td><strong>" .
        "guest3Meal</strong></td><td>: " . $guest3Meal . "</td></tr><tr><td><strong>" .
        "guest4FirstName</strong></td><td>: " . $guest4FirstName . "</td></tr><tr><td><strong>" .
        "guest4LastName</strong></td><td>: " . $guest4LastName . "</td></tr><tr><td><strong>" .
        "guest4Meal</strong></td><td>: " . $guest4Meal . "</td></tr><tr><td><strong>" .
        "guest5FirstName</strong></td><td>: " . $guest5FirstName . "</td></tr><tr><td><strong>" .
        "guest5LastName</strong></td><td>: " . $guest5LastName . "</td></tr><tr><td><strong>" .
        "guest5Meal</strong></td><td>: " . $guest5Meal . "</td></tr><tr><td><strong>" .
        "highchairs</strong></td><td>: " . $highchairs . "</td></tr><tr><td><strong>" .
        "guestsDietaryRestrictions</strong></td><td>: " . $guestsDietaryRestrictions . "</td></tr><tr><td><strong>" .
        "optionalMessage</strong></td><td>: " . $optionalMessage . "</td></tr><tr><td><strong>" .  
        "Time</strong></td><td>: " . date("h:i:s a") . "</td></tr>" .
    "</table>";
    $headers = "Content-type: text/html;";
    $headers .= 'From: warren.shea@gmail.com';
    //$config = "warren.shea@gmail.com";
    mail("$to", "$subject", "$msg", "$headers");
?>