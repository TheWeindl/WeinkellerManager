$(document).ready(function () {

    drawRack();

    $(".place").on("click", function (e) {
        let shelf = parseInt($(this).attr("id").substr(2));
        console.log("Clicked shelf: " + shelf);
        $(".modal-content").attr("data-fID",shelf);

        let buttonHere = $(".modal-footer").find("#selectBtn");
        if(!buttonHere.length) {
            $(".modal-footer").append("<button type=\"button\" class=\"btn btn-primary\" id=\"selectBtn\" data-dismiss=\"modal\">test</button>");
        }

        if($(this).hasClass("taken")) {
            $(".modal-title").empty().append("Gewählte Flasche");
            $(".btn-primary").empty().append("Trinken");
            $(".modal-body").empty();
            $(".modal-content").attr("data-fTaken",1);

            $.ajax({
                url: "../php/Weinkeller.php",
                data: {
                    q: "bottleInfo",
                    shelf: shelf
                },
                type: "GET",
                success: function (data) {
                    let bottles = JSON.parse(data);
                    //console.log(bottles);

                    if(bottles != 0) {
                        $(".modal-title").empty().append(bottles[0]["name"]);
                        $(".modal-body").append("Typ     : " + bottles[0]["type"] + "<br>");
                        $(".modal-body").append("Jahrgang: " + bottles[0]["jahr"] + "<br>");
                        $(".modal-body").append("Land    : " + bottles[0]["land"] + "<br>");
                        $(".modal-body").append("Region  : " + bottles[0]["region"] + "<br>");
                        $(".modal-body").append("Weingut : " + bottles[0]["weingut"] + "<br>");
                        $(".modal-body").append("Stück   : " + bottles[0]["anzahl"] + "<br>");
                    }
                }
            });

        } else {
            $(".modal-title").empty().append("Platzierbare Flaschen");
            $(".btn-primary").empty().append("Platzieren");
            $(".modal-body").empty();
            $("#selectBtn").remove();
            $(".modal-content").attr("data-fTaken",0);

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

                    let empty = true;
                    let $list = $('<ul class="list-group"></ul>');
                    $.each(freeBottles, function(bottleID, num)
                    {
                       if(num > 0 && bottleID != 0){
                           $list.append("<li class='list-group-item d-flex justify-content-between align-items-center'><p>"+items['flaschen'][bottleID - 1].name +"<span class=\"badge badge-primary badge-pill\">"+num+"</span></p><button class='placeBottle' data-id='" + (bottleID) + "' data-dismiss='modal'>Platzieren</button></li>");
                           empty = false;
                       }

                    });
                    $(".modal-body").append($list);
                    if(empty){
                        $(".modal-body").append("Keine Flaschen verfügbar.<br> Alle Flaschen sind bereits im Regal platziert.");
                    }
                },
                error: function (data) {
                    console.log("AJAX call failed");
                }
            });
        }
        $('#put-form-modal').modal();
    });
});

$(document).on("click", ".btn-primary" ,function (e) {
    let shelf = $(".modal-content").attr('data-fID');
    console.log("Shelf: " + shelf);
    console.log("Drink!");
    $.ajax({
        url: "../php/Weinkeller.php",
        data: {
            q: "drinkBottle",
            shelf: shelf
        },
        type: "POST",
        success: function () {
            $(".place#f-" + shelf + " i").removeClass("fas red white").addClass("far");
            $(".place#f-" + shelf + "").removeClass("taken");
        }
    });
});

$(document).on("click",".placeBottle", function (e) {
    let shelf = $(".modal-content").attr('data-fID');
    let bottleID = $(this).data("id");
    console.log("Shelf: " + shelf);
    $.ajax({
        url: "../php/Weinkeller.php",
        data: {
            q: "placeBottle",
            shelf: shelf,
            bottle: bottleID
        },
        type: "POST",
        success: function (data) {
            let items = JSON.parse(data);
            let color;
            console.log("Place clicked");

            if(items.length){
                if(items[0].type == "Rotwein") {
                    color = "red";
                }
                else if(items[0].type == "Weißwein") {
                    color = "white";
                }
            }
            $(".place#f-" + shelf + " i").removeClass("far").addClass("fas " + color);
            $(".place#f-" + shelf + "").addClass("taken");
        },
        error: function () {
            console.log("Placing the bottle failed!");
        }
    });
});


function drawRack(){
    $.ajax({
        url: "../php/Weinkeller.php",
        type: "POST",
        data: {function: "outputRegal"},
        success: function (data) {
            let json = JSON.parse(data);
            //console.log(json);
            $.each(json, function (key, value) {
                if (value.flasche != 0) {
                    //console.log("found one");
                    $(".place#f-" + (key + 1) + " i").removeClass("far").addClass("fas");
                    $(".place#f-" + (key + 1) + "").addClass("taken");
                    if (value.type === "Rotwein") {
                        $(".place#f-" + (key + 1) + " i").addClass("red");
                    } else if (value.type === "Weißwein") {
                        $(".place#f-" + (key + 1) + " i").addClass("white");
                    }
                    //console.log($(".place#f-" + (key + 1) + ""));
                }
                else if(value.flasche == 0){
                    $(".place#f-" + (key + 1) + " i").removeClass("fas red white").addClass("far");
                    $(".place#f-" + (key + 1) + "").removeClass("taken");
                }
            });
        },
        error: function () {
            console.log("AJAX Call failed");
        }
    });
}