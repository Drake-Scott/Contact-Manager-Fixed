<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// search through users and check if the login has an exact match already.
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();

		if($result->num_rows > 0)
		{
			$stmt->close();
			$conn->close();
			returnWithError("Login already exists.");
		}
		else
		{
			$stmt = $conn->prepare("INSERT into Users (firstName, lastName, login, password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}

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
