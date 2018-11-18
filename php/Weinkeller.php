<?php
/**
 * Created by PhpStorm.
 * User: Florian
 * Date: 10.11.2018
 * Time: 17:51
 */

if ($_POST["function"] == "outputRegal")
{
    $connection = mysqli_connect(localhost, pi, raspberry, Weinkeller);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $query = "SELECT * FROM Regal R LEFT JOIN Flaschen F ON F.id = R.flasche";
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
    $connection = mysqli_connect(localhost, pi, raspberry, Weinkeller);
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
