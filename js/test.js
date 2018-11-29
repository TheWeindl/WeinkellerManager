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
                    $(".place#f-" + (key + 1) + " i").removeClass("far");
                    $(".place#f-" + (key + 1) + " i").addClass("fas");
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
            // show infos or drink

        } else {
            // show put table


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
                            freeBottles[value.flasche] = freeBottles[value.flasche] - 1;
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

    $("#closeBtn").on("click", function (e) {
        $(".modal-body").remove();
        console.log("Removed entries");
    });
});