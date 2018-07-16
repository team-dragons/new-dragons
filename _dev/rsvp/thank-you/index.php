<?php
    header("Expires:Mon, 31 Dec 2010 05:00:00 GMT");

    include '/home/163663/domains/zena-and-warren.com/html/includes/database-connection.php';

    $srvr_remote_addr = $_SERVER['REMOTE_ADDR'];
    $srvr_http_user_agent = $_SERVER['HTTP_USER_AGENT'];
    $srvr_http_referer = $_SERVER['HTTP_REFERER'];
    $srvr_query_string = $_SERVER['QUERY_STRING'];

    ini_set('sendmail_from', 'warren.shea@gmail.com');
    date_default_timezone_set("America/Toronto");

    $guest1FirstName = filter_input(INPUT_POST, "guest1FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest1LastName = filter_input(INPUT_POST, "guest1LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest1Meal = filter_input(INPUT_POST, "guest1Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $attendance = filter_input(INPUT_POST, "attendance", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest2FirstName = filter_input(INPUT_POST, "guest2FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest2LastName = filter_input(INPUT_POST, "guest2LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest2Meal = filter_input(INPUT_POST, "guest2Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest3FirstName = filter_input(INPUT_POST, "guest3FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest3LastName = filter_input(INPUT_POST, "guest3LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest3Meal = filter_input(INPUT_POST, "guest3Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest4FirstName = filter_input(INPUT_POST, "guest4FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest4LastName = filter_input(INPUT_POST, "guest4LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest4Meal = filter_input(INPUT_POST, "guest4Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest5FirstName = filter_input(INPUT_POST, "guest5FirstName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest5LastName = filter_input(INPUT_POST, "guest5LastName", FILTER_SANITIZE_SPECIAL_CHARS);
    $guest5Meal = filter_input(INPUT_POST, "guest5Meal", FILTER_SANITIZE_SPECIAL_CHARS);
    $highchairs = filter_input(INPUT_POST, "highchairs", FILTER_SANITIZE_SPECIAL_CHARS);
    $guestsDietaryRestrictions = filter_input(INPUT_POST, "guestsDietaryRestrictions", FILTER_SANITIZE_SPECIAL_CHARS);
    $optionalMessage = filter_input(INPUT_POST, "optionalMessage", FILTER_SANITIZE_SPECIAL_CHARS);

    $statement = "INSERT INTO guestRSVP(guest1FirstName,guest1LastName,guest1Meal,attendance,guest2FirstName,guest2LastName,guest2Meal,guest3FirstName,guest3LastName,guest3Meal,guest4FirstName,guest4LastName,guest4Meal,guest5FirstName,guest5LastName,guest5Meal,highchairs,guestsDietaryRestrictions,optionalMessage,submit_time) VALUES (:guest1FirstName,:guest1LastName,:guest1Meal,:attendance,:guest2FirstName,:guest2LastName,:guest2Meal,:guest3FirstName,:guest3LastName,:guest3Meal,:guest4FirstName,:guest4LastName,:guest4Meal,:guest5FirstName,:guest5LastName,:guest5Meal,:highchairs,:guestsDietaryRestrictions,:optionalMessage,DATE_ADD(NOW(), INTERVAL 1 HOUR))";
    $query = $pdo->prepare($statement);
    try {
      $query->execute(array(
        ':guest1FirstName' => $guest1FirstName,
        ':guest1LastName' => $guest1LastName,
        ':guest1Meal' => $guest1Meal,
        ':attendance' => $attendance,
        ':guest2FirstName' => $guest2FirstName,
        ':guest2LastName' => $guest2LastName,
        ':guest2Meal' => $guest2Meal,
        ':guest3FirstName' => $guest3FirstName,
        ':guest3LastName' => $guest3LastName,
        ':guest3Meal' => $guest3Meal,
        ':guest4FirstName' => $guest4FirstName,
        ':guest4LastName' => $guest4LastName,
        ':guest4Meal' => $guest4Meal,
        ':guest5FirstName' => $guest5FirstName,
        ':guest5LastName' => $guest5LastName,
        ':guest5Meal' => $guest5Meal,
        ':highchairs' => $highchairs,
        ':guestsDietaryRestrictions' => $guestsDietaryRestrictions,
        ':optionalMessage' => $optionalMessage
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
<!DOCTYPE html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <title>Zena Jun &amp; Warren Shea Wedding</title>
    <meta name="robots" content="noindex">
    <link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great|Playfair+Display|Poppins:500,700" rel="stylesheet">
    <link rel="stylesheet" href="/stylesheets/vendor/foundation.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/stylesheets/global.css">
  </head>
  <body class="the-dragons">
    <nav class="container">
      <div class="hamburger-menu show-for-small-only">
        <div id="nav-icon" class="nav-icon">
          <span class="menu"></span>
          <span class="menu"></span>
          <span class="menu"></span>
          <span class="menu"></span>
        </div>
      </div>
      <div class="logo-menu-container hide-for-small-only show-for-medium-up scroll-reveal-nav-sticky">
        <nav class="wrapper align-self-middle main-nav">
          <a href="/" class="logo align-self-middle">
            <svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
              xml:space="preserve" version="1.1" width="147" height="101" viewBox="0 0 147 101" class="monogram">
              <path class="svg-fill" d="M0,76.07790698486178 L28.10377483526434,32.93642396532745 H3.6065797324273943 v-2.4495776853811684 H32.25483826872056 v0.680208755805676 L4.219033821207405,74.30885934147324 H33.00320559418692 v2.4504956459153195 H0 v-0.6814480025267792"
                stroke-width="0" />
              <path class="svg-fill" d="M87.42564331197943,30.486846279946292 H90.4191126138449 l11.29596335299156,37.22146373874298 c0.34056335816991307,1.2245593525570466 0.6806677360727511,3.0628212202205503 0.7490557958669791,3.3344457422757454 c0,-0.20424621884853303 0.4080334574299906,-2.1098863897186986 0.8844549746542086,-3.3344457422757454 l13.26911952114851,-37.766273315761424 h0.8160669148599812 L130.70381065504878,67.70831001868926 c0.4080334574299906,1.2245593525570466 0.7481378353328283,3.0628212202205503 0.8165258951270561,3.3344457422757454 c0,-0.20424621884853303 0.4080334574299906,-2.1098863897186986 0.8160669148599812,-3.3344457422757454 l11.29596335299156,-37.22146373874298 h2.8580701230782344 L131.996299087133,77.30333839992628 h-0.748596815599904 l-13.472906759729966,-38.37905787033373 c-0.40849243769706595,-1.2245593525570466 -0.6811267163398265,-2.9259992026053876 -0.748596815599904,-3.3340326600353776 c-0.06838805979422793,0.27217529837568555 -0.40849243769706595,2.0410852476841024 -0.8169848753941319,3.3340326600353776 L102.66791900128489,77.30333839992628 h-0.747678855065753 l-14.494596834239704,-46.81649211997997"
                stroke-width="0" />
              <path class="svg-fill" d="M61.90496352178848,0 v100.538816024521285 h1.25 v-100" />
            </svg>
          </a>
          <ul class="align-self-middle">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/schedule/">Schedule</a>
            </li>
            <li>
              <a href="/faqs/">FAQs</a>
            </li>
            <li>
              <a href="/accommodations/">Accommodations</a>
            </li>
            <li>
              <a href="/rsvp/">RSVP</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="logo-menu-container hide-for-small-only show-for-medium-up scroll-hide-nav">
        <nav class="wrapper align-self-middle">
          <a href="/" class="logo align-self-middle">
            <svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" width="147" height="101" viewBox="0 0 147 101" class="monogram">
              <path class="svg-fill" d="M0,76.07790698486178 L28.10377483526434,32.93642396532745 H3.6065797324273943 v-2.4495776853811684 H32.25483826872056 v0.680208755805676 L4.219033821207405,74.30885934147324 H33.00320559418692 v2.4504956459153195 H0 v-0.6814480025267792" stroke-width="0" />
              <path class="svg-fill" d="M87.42564331197943,30.486846279946292 H90.4191126138449 l11.29596335299156,37.22146373874298 c0.34056335816991307,1.2245593525570466 0.6806677360727511,3.0628212202205503 0.7490557958669791,3.3344457422757454 c0,-0.20424621884853303 0.4080334574299906,-2.1098863897186986 0.8844549746542086,-3.3344457422757454 l13.26911952114851,-37.766273315761424 h0.8160669148599812 L130.70381065504878,67.70831001868926 c0.4080334574299906,1.2245593525570466 0.7481378353328283,3.0628212202205503 0.8165258951270561,3.3344457422757454 c0,-0.20424621884853303 0.4080334574299906,-2.1098863897186986 0.8160669148599812,-3.3344457422757454 l11.29596335299156,-37.22146373874298 h2.8580701230782344 L131.996299087133,77.30333839992628 h-0.748596815599904 l-13.472906759729966,-38.37905787033373 c-0.40849243769706595,-1.2245593525570466 -0.6811267163398265,-2.9259992026053876 -0.748596815599904,-3.3340326600353776 c-0.06838805979422793,0.27217529837568555 -0.40849243769706595,2.0410852476841024 -0.8169848753941319,3.3340326600353776 L102.66791900128489,77.30333839992628 h-0.747678855065753 l-14.494596834239704,-46.81649211997997" stroke-width="0" />
              <path class="svg-fill" d="M61.90496352178848,0 v100.538816024521285 h1.25 v-100" />
            </svg>
          </a>
          <ul class="align-self-middle">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/schedule/">Schedule</a>
            </li>
            <li>
              <a href="/faqs/">FAQs</a>
            </li>
            <li>
              <a href="/accommodations/">Accommodations</a>
            </li>
            <li>
              <a href="/rsvp/">RSVP</a>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
    <main class="rsvp">
      <header>
        <div class="wrapper align-self-middle">
          <h1 class="h1 uppercase scroll-reveal">Thank you!</h1>
        </div>
      </header>
    </main>
    <footer class="background-full-separator">
      <div class="wrapper">
        <img src="/images/loki.png" class="loki">
        <p>♡ Designed and developed with love ♡</p>
        <p>by <a href="http://www.zenajun.com" target="_blank" class="reverse">Zena</a> &amp; <a href="http://www.warrenshea.com" target="_blank" class="reverse">Warren</a> &amp; <a href="https://www.facebook.com/Loki-The-Dog-of-Mischief-583192948469940/" target="_blank" class="reverse">Loki</a></p>
      </div>
    </footer>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
      crossorigin="anonymous"></script>
    <script src="/scripts/vendor/foundation.js"></script>
    <script src="/scripts/global.js"></script>
  </body>
</html>
