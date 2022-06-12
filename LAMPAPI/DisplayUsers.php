<?php

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }

    $sql = "SELECT ID, FirstName, LastName, Login, Password FROM Users";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) 
        {
            echo "id: " . $row["ID"]. " - Name: " . $row["FirstName"]. " " . $row["LastName"]. " - login: "
            . $row["Login"]. " - Password: " . $row["Password"]. "<br>";
        }
    } 
    else 
    {
    echo "0 results";
    }
    $conn->close();

?>
