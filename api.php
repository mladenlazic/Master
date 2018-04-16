<?php
	
	include_once ("php/connect_to_mysql.php");
	$method = $_SERVER['REQUEST_METHOD'];
	$url_params = explode("/", $_SERVER['PATH_INFO']);

	if($method == "POST" && $url_params[1] == "login")
	{
		$email = $url_params[2];
		
		$url = "select * from Users where email = '$email'";
		
		$json_response = "";
		
		$res=mysqli_query($myConnection, $url);
		$row=mysqli_fetch_array($res);
		$count = mysqli_num_rows($res);

	  if( $count == 1 )
	  		$json_response = '{"login":true,"id":"' . $row[0] . '","password":"' . $row[4] . '"}';
		else
			$json_response = '{"login":false}';
		
		echo $json_response;
	}

?>