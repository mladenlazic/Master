<?php  
$db_host = "localhost"; 
$db_username = "root";  
$db_pass = "";  
$db_name = "id1660589_vrpbase"; 
$myConnection = mysqli_connect("$db_host","$db_username","$db_pass", "$db_name") or die ("could't connect to mysql"); 
mysqli_set_charset($myConnection, 'utf8');
?>