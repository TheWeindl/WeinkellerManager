$(document).ready(function() {

  drawRack();

  $(".place").on("click", function(e) {
    let shelf = parseInt($(this).attr("id").substr(2));
    $(".modal-content").attr("data-fID", shelf);

    if ($(this).hasClass("taken")) {

      let removeBtnHere = $(".modal-footer").find("#removeBtn");
      if (!removeBtnHere.length) {
        $(".modal-footer").append("<button type=\"button\" class=\"btn btn-secondary\" id=\"removeBtn\" data-dismiss=\"modal\">test</button>");
      }

      let buttonHere = $(".modal-footer").find("#selectBtn");
      if (!buttonHere.length) {
        $(".modal-footer").append("<button type=\"button\" class=\"btn btn-primary\" id=\"selectBtn\" data-dismiss=\"modal\">test</button>");
      }

      $(".modal-title").empty().append("Gewählte Flasche");
      $(".btn-primary").empty().append("Trinken");
      $(".modal-body").empty();
      $(".modal-content").attr("data-fTaken", 1);
      $("#removeBtn").empty().append("Entfernen");

      $.ajax({
        url: "../php/Weinkeller.php",
        data: {
          q: "bottleInfo",
          shelf: shelf
        },
        type: "GET",
        success: function(data) {
          let bottles = JSON.parse(data);
          if (bottles != 0) {
            $(".modal-title").empty().append(bottles[0]["name"]);

            $(".modal-body").append(`
                          <table class="table table-hover table-sm">
                          <tr> <td><span>Typ</span></td>      <td><span>${bottles[0]["type"]}</span></td>   	</tr>
                          <tr> <td><span>Jahrgang</span></td> <td><span>${bottles[0]["jahr"]}</span></td>     </tr>
                          <tr> <td><span>Land</span></td>     <td><span>${bottles[0]["land"]}</span></td>     </tr>
                          <tr> <td><span>Region</span></td>   <td><span>${bottles[0]["region"]}</span></td>   </tr>
                          <tr> <td><span>Weingut</span></td>  <td><span>${bottles[0]["weingut"]}</span></td>  </tr>
                          <tr> <td><span>Stück</span></td>    <td><span>${bottles[0]["anzahl"]}</span></td>   </tr>
                          </tbody></table>`);

            /*
            $(".modal-body").append("<div class=\"col-md-12\"><p>" + $type + bottles[0]["type"] + "</p></div>");
            $(".modal-body").append("<div class=\"col-md-12\"><p>Jahrgang: " + bottles[0]["jahr"] + "</p></div>");
            $(".modal-body").append("<div class=\"col-md-12\"><p>Land    : " + bottles[0]["land"] + "</p></div>");
            $(".modal-body").append("<div class=\"col-md-12\"><p>Region  : " + bottles[0]["region"] + "</p></div>");
            $(".modal-body").append("<div class=\"col-md-12\"><p>Weingut : " + bottles[0]["weingut"] + "</p></div>");
            $(".modal-body").append("<div class=\"col-md-12\"><p>Stück   : " + bottles[0]["anzahl"] + "</p></div>");
            */
          }
        }
      });

    } else {
      $(".modal-title").empty().append("Platzierbare Flaschen");
      $(".btn-primary").empty().append("Platzieren");
      $(".modal-body").empty();
      $("#selectBtn").remove();
      $("#removeBtn").empty().remove();
      $(".modal-content").attr("data-fTaken", 0);

      $.ajax({
        url: "../php/Weinkeller.php",
        data: {
          q: "fandr"
        },
        type: "GET",
        success: function(data) {
          let items = JSON.parse(data);
          console.log(items);

          //Calculate unplaced bottles
          let freeBottles = new Array();
          $.each(items["flaschen"], function(key, value) {
            freeBottles[value.id] = value.anzahl;
          });
          $.each(items["regal"], function(key, value) {
            if (value.flasche != 0) {
              freeBottles[value.flasche]--;
            }
          });

          let empty = true;
          let $list = $('<ul class="list-group"></ul>');
          $.each(freeBottles, function(bottleID, num) {
            if (num > 0 && bottleID != 0) {
              $list.append("<li class='list-group-item d-flex justify-content-between align-items-center'><p>" + items['flaschen'][bottleID].name + " <span class=\"badge badge-custom-" + items['flaschen'][bottleID].type + " badge-pill\">" + num + "x</span></p><button class='placeBottle btn btn-outline-success' data-id='" + (bottleID) + "' data-dismiss='modal'>Platzieren</button></li>");
              empty = false;
            }

          });
          $(".modal-body").append($list);
          if (empty) {
            $(".modal-body").append("Keine Flaschen verfügbar.<br> Alle Flaschen sind bereits im Regal platziert.");
          }

        },
        error: function(data) {
          console.log("AJAX call failed");
        }
      });
    }
    $('#put-form-modal').modal();
  });
});

$(document).on("click", ".btn-primary", function(e) {
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
    success: function() {
      $(".place#f-" + shelf + " i:first-child").removeClass("fas red white").addClass("far");
      $(".place#f-" + shelf + "").removeClass("taken");
    }
  });
});

$(document).on("click", "#removeBtn", function(e) {
  let shelf = $(".modal-content").attr('data-fID');
  console.log("Shelf: " + shelf);
  console.log("Remove");
  $.ajax({
    url: "../php/Weinkeller.php",
    data: {
      q: "removeBottle",
      shelf: shelf
    },
    type: "POST",
    success: function() {
      $(".place#f-" + shelf + " i:first-child").removeClass("fas red white").addClass("far");
      $(".place#f-" + shelf + "").removeClass("taken");
    }
  });
});

$(document).on("click", ".placeBottle", function(e) {
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
    success: function(data) {
      let items = JSON.parse(data);
      let color;
      console.log("Place clicked");
      if (items.length) {
        if (items[0].type == "Rotwein") {
          color = "red";
        } else if (items[0].type == "Weißwein") {
          color = "white";
        }
      }
      $(".place#f-" + shelf + " i:first-child").removeClass("far").addClass("fas " + color);
      $(".place#f-" + shelf + "").addClass("taken");
    },
    error: function() {
      console.log("Placing the bottle failed!");
    }
  });
});


function drawRack() {
  $.ajax({
    url: "../php/Weinkeller.php",
    type: "POST",
    data: {
      function: "outputRegal"
    },
    success: function(data) {
      let json = JSON.parse(data);
      //console.log(json);
      $.each(json, function(key, value) {
        if (value.flasche != 0) {
          //console.log("found one");
          $(".place#f-" + (key + 1) + " i:first-child").removeClass("far").addClass("fas");
          $(".place#f-" + (key + 1) + "").addClass("taken");
          if (value.type === "Rotwein") {
            $(".place#f-" + (key + 1) + " i:first-child").addClass("red");
          } else if (value.type === "Weißwein") {
            $(".place#f-" + (key + 1) + " i:first-child").addClass("white");
          }
          if(findGetParameter("id")) {
            if(value.id != findGetParameter("id")) {
              $(".place#f-" + (key + 1) + " i:first-child").addClass('op-2');
            }
          }
          //console.log($(".place#f-" + (key + 1) + ""));
        } else if (value.flasche == 0) {
          $(".place#f-" + (key + 1) + " i:first-child").removeClass("fas red white").addClass("far");
          $(".place#f-" + (key + 1) + "").removeClass("taken");
        }
      });
    },
    error: function() {
      console.log("AJAX Call failed");
    }
  });
}

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
