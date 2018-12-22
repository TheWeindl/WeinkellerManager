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


if ($_POST["function"] == "outputRegal") {
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
    mysqli_close($connection);
    die();
}


if ($_GET["q"] == "fandr") {
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
    mysqli_close($connection);
    die();
}

if ($_POST["q"] == "drinkBottle") {
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
    mysqli_close($connection);
    die();
}

if ($_POST["q"] == "removeBottle") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        $shelf = $_POST["shelf"];
        $query = "UPDATE Regal SET flasche=0 WHERE ID = $shelf"; //Remove bottle from rack

        $result = mysqli_query($connection, $query);
    }
    mysqli_close($connection);
    die();
}

if ($_GET["q"] == "bottleInfo") {
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
    mysqli_close($connection);
    die();
}

if ($_POST["q"] == "placeBottle") {
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
    mysqli_close($connection);
    die();
}

if ($_POST["q"] == "addBottle") {
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
    mysqli_close($connection);
    die();
}

if ($_GET["q"] == "search") {
    $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE);
    if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    } else {
        header("Content-Type: application/json");

        $query = "SELECT * FROM Flaschen;";
        $result = mysqli_query($connection, $query);

        $flaschen = array();
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($flaschen, $row);
        }
        echo json_encode($flaschen);

        mysqli_close($connection);
        die();

        //1. aufspliten bei ;
        $tags = explode(";", $_GET["query"]);
        if (!is_array($tags) || empty($tags)) {
            return false;
            mysqli_close($connection);
            die();
        }

        //2. entfernen von html speacial char
        foreach ($tags as $key => $value) {
            $tags[$key] = trim(strip_tags(htmlspecialchars($value)));
        }

        //3. type prüfen (weinsorte)
        $type = false;
        foreach ($tags as $key => $value) {
            if (strpos($value, "Weißwein") !== false) {
                $type = "Weißwein";
                unset($tags[$key]);
            } elseif (strpos($value, "Rotwein") !== false) {
                $type = "Rotwein";
                unset($tags[$key]);
            }
        }

        //4. numerischer wert
        $year = false;
        foreach ($tags as $key => $value) {
            if (is_numeric($value)) {
                $year = $value;
                unset($tags[$key]);
            }
        }

        //5.
        $whereType = "";
        $whereYear = "";
        $searchable = ["name", "land", "region", "weingut"];
        $finalResults = array();
        if ($type) {
            $whereType = "type='" . $type . "'";
        }
        if ($year) {
            $whereYear = "jahr='" . $year . "'";
        }

        foreach ($tags as $key => $value) {
            foreach ($searchable as $k => $v) {
                $query1 = "SELECT * FROM `Flaschen` WHERE ";
                if ($type && $year) {
                    $result1 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%' AND " . $whereType . " AND " . $whereYear);
                    $result2 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%' AND " . $whereType . " OR " . $whereYear);
                } elseif ($type && !$year) {
                    $result1 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%' AND " . $whereType);
                    $result2 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%' AND " . $whereType);
                } elseif ($year && !$type) {
                    $result1 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%' AND " . $whereYear);
                    $result2 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%' AND " . $whereYear);
                } else {
                    $result1 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%'");
                    $result2 = mysqli_query($connection, $query1 . $v . " LIKE '%" . $value . "%'");
                }

                while ($row = mysqli_fetch_assoc($result1)) {
                    if (!$finalResults[$row["ID"]]) {
                        $finalResults[$row["ID"]] = $row;
                    }
                }

                while ($row = mysqli_fetch_assoc($result2)) {
                    if (!$finalResults[$row["ID"]]) {
                        $finalResults[$row["ID"]] = $row;
                    }
                }
            }
        }
        echo json_encode(["success" => true, "data" => $finalResults]);
    }
    mysqli_close($connection);
    die();
}