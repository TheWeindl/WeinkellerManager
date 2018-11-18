$(document).ready(function () {
    $.ajax({
        url: "../php/Weinkeller.php",
        type: "POST",
        data: {function: "outputRegal"},
        success: function (data) {
            let json = JSON.parse(data);

            console.log(json);

            //$("#test").append('<table border="1"><tr><td>Stellplatz</td><td>Flaschen ID</td></tr>');
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
                    console.log(items);
                },
                error: function (data) {

                }

            });
        }
        $('#put-form-modal').modal();
    })
});