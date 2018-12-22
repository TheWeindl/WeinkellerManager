/**
 * Created by Florian on 09.12.2018.
 */

$(document).ready(function() {
  $.ajax({
    url: '../php/Weinkeller.php',
    type: 'GET',
    data: {
      q: "search",
      query: ""
    },
    error: function() {},
    success: function(response) {
      $("#winename").selectize({
        valueField: 'name',
        labelField: 'name',
        closeAfterSelect: true,
        searchField: ['name'],
        options: response,
        render: {
          option: function(item, escape) {
            return "<p>" + escape(item.name) + "</p>";
          }
        },
        create: true
      });
      $("#winecountry").selectize({
        valueField: 'land',
        closeAfterSelect: true,
        labelField: 'land',
        searchField: ['land'],
        options: response,
        render: {
          option: function(item, escape) {
            return "<p>" + escape(item.land) + "</p>";
          }
        },
        create: true
      });
      $("#wineregion").selectize({
        valueField: 'region',
        labelField: 'region',
        closeAfterSelect: true,
        searchField: ['region'],
        options: response,
        render: {
          option: function(item, escape) {
            return "<p>" + escape(item.region) + "</p>";
          }
        },
        create: true
      });
      $("#winewinery").selectize({
        valueField: 'weingut',
        labelField: 'weingut',
        closeAfterSelect: true,
        searchField: ['weingut'],
        options: response,
        render: {
          option: function(item, escape) {
            return "<p>" + escape(item.weingut) + "</p>";
          }
        },
        create: true
      });

    }
  });
});

$("#submit-btn").on("click", function() {
  let $t = $(this);
  $(this).text("Loading ...");
  $.ajax({
    url: "../php/Weinkeller.php",
    type: 'GET',
    data: {
      q: "addBottle",
      type: $('#winetype').val(),
      name: $('#winename').val(),
      year: $('#wineyear').val(),
      country: $('#winecountry').val(),
      region: $('#wineregion').val(),
      winery: $('#winewinery').val(),
      amount: $('#wineamount').val(),
    },
    error: function(data) {
      $t.text("Fehler");
    },
    success: function(data) {
      $t.text("Erfolg");
    }
  });
});
