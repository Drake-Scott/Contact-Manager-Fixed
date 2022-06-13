<?php
	$inData = getRequestInfo();

    $userID =  $inData["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $login = $inData["login"];
	//$password = $inData["password"];
    
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// $sql = "SELECT * FROM Users WHERE Login=?";
		// $result = $conn->query($sql);

		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		if($row["ID"] != $userID)
			{
				$stmt->close();
				$conn->close();
				returnWithError("Login already exists.");
			}

		// while($row = $result->fetch_assoc()) 
		// {
		// 	if($row["ID"] != $userID)
		// 	{
		// 		$stmt->close();
		// 		$conn->close();
		// 		returnWithError("Login already exists.");
		// 	}
		// }
		
		$stmt->close();
		$stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Login=? WHERE ID=?");
		$stmt->bind_param("sssi", $firstName ,$lastName, $login, $userID);
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
