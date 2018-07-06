<?php
	$q = $_REQUEST["q"];
    
    $json = '{"foo-bar": 12345}';

    $obj = json_decode($json);
    echo $obj->{'foo-bar'}; // 12345



?>