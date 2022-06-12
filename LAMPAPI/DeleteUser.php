<?php
    $inData = getRequestInfo();
    $ID = $inData["ID"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

        $sql = "SELECT ID FROM Users WHERE ID=" . $ID;
        $result = $conn->query($sql);

        if ($result->num_rows <= 0)
        {
            $conn->close();
            $result->close();
            returnWithError("Invalid User ID.");
        }
        else
        {
            $stmt = $conn->prepare("DELETE FROM Users WHERE ID=?");
            $stmt->bind_param("i", $ID);
            $stmt->execute();
            
            // $sql = "SELECT ID, FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE UserID=". $ID;
            // $result = $conn->query($sql);
            // $iter = $result->num_rows;

            // if ($result->num_rows > 0) 
            // {
            //     while($row = $result->fetch_assoc()) 
            //     {
            //         $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
            //         $stmt->bind_param("i", $ID);
            //         $stmt->execute();
            //     }
            // } 
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
            $stmt->bind_param("i", $ID);
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
