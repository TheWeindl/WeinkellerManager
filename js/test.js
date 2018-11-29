$(document).ready(function () {
    $.ajax({
        url: "../php/Weinkeller.php",
        type: "POST",
        data: {function: "outputRegal"},
        success: function (data) {
            let json = JSON.parse(data);
            console.log(json);
            $.each(json, function (key, value) {
                if (value.flasche != 0) {
                    console.log("found one");
                    $(".place#f-" + (key + 1) + " i").removeClass("far").addClass("fas");
                    $(".place#f-" + (key + 1) + "").addClass("taken");
                    if (value.type === "Rotwein") {
                        $(".place#f-" + (key + 1) + " i").addClass("red");
                    } else if (value.type === "Weißwein") {
                        $(".place#f-" + (key + 1) + " i").addClass("white");
                    }
                    console.log($(".place#f-" + (key + 1) + ""));
                }
            });
            //$("#test").append('</table>');
        },
        error: function () {
            console.log("AJAX Call failed");
        }
    });

    $(".place").on("click", function (e) {
        if($(this).hasClass("taken")) {
            $(".modal-title").empty().append("Gewählte Flasche");
            $(".btn-primary").empty().append("Trinken");
            $(".modal-body").empty();

            let shelf = parseInt($(this).attr("id").substr(2));
            console.log("shelf " + shelf);
            $.ajax({
                url: "../php/Weinkeller.php",
                data: {
                    q: "bottleInfo",
                    id: shelf
                },
                type: "GET",
                success: function (data) {
                    let bottles = JSON.parse(data);
                    console.log(bottles);

                    $(".modal-title").empty().append(bottles[0]["name"]);
                    $(".modal-body").append("Typ     : " + bottles[0]["type"] + "<br>");
                    $(".modal-body").append("Jahrgang: " + bottles[0]["jahr"] + "<br>");
                    $(".modal-body").append("Land    : " + bottles[0]["land"] + "<br>");
                    $(".modal-body").append("Region  : " + bottles[0]["region"] + "<br>");
                    $(".modal-body").append("Weingut : " + bottles[0]["weingut"] + "<br>");
                    $(".modal-body").append("Stück   : " + bottles[0]["anzahl"] + "<br>");
                }
            });

        } else {
            $(".modal-title").empty().append("Platzierbare Flaschen");
            $(".btn-primary").empty().append("Platzieren");
            $(".modal-body").empty();

            $.ajax({
                url: "../php/Weinkeller.php",
                data: {
                    q: "fandr"
                },
                type: "GET",
                success: function (data) {
                    let items = JSON.parse(data);

                    //Calculate unplaced bottles
                    let freeBottles = new Array();
                    $.each(items["flaschen"], function(key, value){
                            freeBottles[value.ID] = value.anzahl;
                    });
                    $.each(items["regal"], function(key, value){
                        if(value.flasche != 0) {
                            freeBottles[value.flasche]--;
                        }
                    });

                    $.each(freeBottles, function(bottleID, num)
                    {
                       if(num >= 0 && bottleID != 0){
                           $(".modal-body").append("x" + num + " " + items["flaschen"][bottleID - 1].name + "<br>");
                       }
                    });
                },
                error: function (data) {

                }

            });




        }
        $('#put-form-modal').modal();
    });

    $(".btn-primary").on("click", function (e) {
       console.log("Drink!");
    });
});