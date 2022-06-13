<?php
	$inData = getRequestInfo();

    $userID =  $inData["userID"];
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
		$select = mysqli_query($conn, "SELECT * FROM users WHERE username = '".$login."'");
		if(mysqli_num_rows($select)) {
			exit('This username already exists');
		}
		// search through users and check if the login has an exact match already.
		// $stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
		// $stmt->bind_param("s", $login);
		// $stmt->execute();
		// $result = $stmt->get_result();

		// $sql = "SELECT * FROM Users WHERE Login=".$login;
		// $result = $conn->query($sql);
		while($row = $result->fetch_assoc()) 
		{
			if($row["ID"] != $userID)
			{
				$stmt->close();
				$conn->close();
				returnWithError("Login already exists.");
			}
		}

		$stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Login=?, Password=? WHERE ID=?");
		$stmt->bind_param("ssssi", $firstName ,$lastName, $login, $password, $userID);
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
