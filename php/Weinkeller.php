<?php
/**
 * Created by PhpStorm.
 * User: Florian
 * Date: 10.11.2018
 * Time: 17:51
 */

define(HOST, localhost);
define(USER, pi);
define(PASSWORD, 'Florianw1!');
define(DATABASE, Weinkeller);

if ($_POST["function"] == "outputRegal")
{
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $query = "SELECT * FROM Regal R LEFT JOIN Flaschen ON Flaschen.ID = R.flasche";
        $result = mysqli_query($connection, $query);

        $temp = array();
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($temp, $row);
        }
        echo json_encode($temp);
    }
    mysqli_close($connection);die();
}


if($_GET["q"] == "fandr") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $query = "SELECT * FROM Regal;";
        $query2 = "SELECT * FROM Flaschen;";
        $result = mysqli_query($connection, $query);
        $result2 = mysqli_query($connection, $query2);

        $regal = array();
        $flaschen = array();
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($regal, $row);
        }
        while ($row = mysqli_fetch_assoc($result2)) {
            array_push($flaschen, $row);
        }
        echo json_encode(["flaschen" => $flaschen, "regal" => $regal]);
    }
    mysqli_close($connection);die();
}

if($_POST["q"] == "drinkBottle") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $shelf = $_POST["shelf"];

        $query1 = "UPDATE Flaschen SET anzahl=anzahl-1, getrunken=getrunken+1  WHERE ID = (SELECT Regal.flasche FROM Regal WHERE Regal.ID=$shelf)";     //Decerement bottle stock
        $query2 = "UPDATE Regal SET flasche=0 WHERE ID = $shelf";                //Remove bottle from rack

        $result1 = mysqli_query($connection, $query1);
        $result2 = mysqli_query($connection, $query2);
    }
    mysqli_close($connection);die();
}

if($_POST["q"] == "removeBottle") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $shelf = $_POST["shelf"];
        $query = "UPDATE Regal SET flasche=0 WHERE ID = $shelf"; //Remove bottle from rack

        $result = mysqli_query($connection, $query);
    }
    mysqli_close($connection);die();
}

if($_GET["q"] == "bottleInfo") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $shelf = $_GET["shelf"];
        $query = "SELECT * FROM Flaschen WHERE Flaschen.ID=(SELECT Regal.flasche FROM Regal WHERE Regal.ID=$shelf)";
        $result = mysqli_query($connection, $query);
        $flaschen = array();
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($flaschen, $row);
        }
        echo json_encode($flaschen);
    }
    mysqli_close($connection);die();
}

if($_POST["q"] == "placeBottle") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $shelf = $_POST["shelf"];
        $bottleID = $_POST["bottle"];

        //Update rack
        $query = "UPDATE Regal SET flasche=$bottleID WHERE ID = $shelf";    //Add bottle to rack
        $result = mysqli_query($connection, $query);

        //Return placed bootle info
        $query = "SELECT * FROM Flaschen WHERE Flaschen.ID=(SELECT Regal.flasche FROM Regal WHERE Regal.ID=$shelf)";
        $result = mysqli_query($connection, $query);

        $flaschen = array();
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($flaschen, $row);
        }
        echo json_encode($flaschen);
    }
    mysqli_close($connection);die();
}

if($_POST["q"] == "addBottle") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $type = $_POST["type"];
        $name = $_POST["name"];
        $year = $_POST["year"];
        $country = $_POST["country"];
        $region = $_POST["region"];
        $winery = $_POST["winery"];
        $amount = $_POST["amount"];

        //Add new bottle to the table
        $query = "INSERT INTO Flaschen(name, type, jahr, land, region, weingut, anzahl, getrunken) VALUES ($name, $type, $year, $country, $region, $winery, $amount , 0)";
        $result = mysqli_query($connection, $query);
    }
    mysqli_close($connection);die();
}