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

        $sql = "SELECT ID FROM Contacts WHERE ID=".$ID;
        $result = $conn->query($sql);

        if ($result->num_rows <= 0)
        {
            $conn->close();
            $result->close();
            returnWithError("Invalid Contact ID.");
        }
        else
        {
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
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
