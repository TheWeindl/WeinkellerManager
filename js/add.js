/**
 * Created by Florian on 09.12.2018.
 */

$(document).ready(function () {

    $('#select-type').selectize({
        placeholder: "Test",
        sortField: "text",
        create: false,
        maxItems: 1,
        options: [  {value: "redWine", text: "Rotwein"},
                    {value: "whiteWine", text: "Weißwein"}]
    });
});

$(document).on("click", ".addBtn" ,function (e) {

    $.ajax({
        url: "../php/Weinkeller.php",
        data: {
            q: "addBottle",
            type: document.getElementById("type").value,
            name: document.getElementById("name").value,
            year: document.getElementById("year").value,
            country: document.getElementById("country").value,
            region: document.getElementById("region").value,
            winery: document.getElementById("winery").value,
            amount: document.getElementById("amount").value
        },
        type: "POST",
        success: function () {
            console.log("Bottle added to database");
        }
    });
});