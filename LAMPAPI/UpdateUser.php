<?php
	$inData = getRequestInfo();

    $userID =  $inData["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    //$login = $inData["login"];
	//$password = $inData["password"];
    
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// $stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Login=?, Password=? WHERE ID=?");
		// $stmt->bind_param("ssssi", $firstName ,$lastName, $login, $password, $userID);
		$stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=? WHERE ID=?");
		$stmt->bind_param("ssi", $firstName ,$lastName, $userID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
