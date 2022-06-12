<?php

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }

    $sql = "SELECT ID, FirstName, LastName, Phone, Email, UserID FROM Contacts";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) 
        {
            echo "id: " . $row["ID"]. " - Name: " . $row["FirstName"]. " " . $row["LastName"]. " - Phone: "
            . $row["Phone"]. " - Email: " . $row["Email"]. " - UserID: ". $row["UserID"]. "<br>";
        }
    } 
    else 
    {
    echo "0 results";
    }
    $conn->close();

?>
