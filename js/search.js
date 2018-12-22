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
      $("#search-box").selectize({
        valueField: 'id', // value, also wenn man auf das result click, der "ID" des Feldes zB valueField= flaschen_ID; labelField = flaschen_name;
        labelField: 'name', // LAbel, welches standardmäßig als result angezeigt wird
        searchField: ['name', 'type', 'jahr', 'land', 'region', 'weingut'], // felder die bei der eingabe durchsucht werden
        options: response,
        render: {
          option: function(item, escape) {
            return `<div><p>${escape(item.name)} (${escape(item.land)}, ${escape(item.region)}, ${escape(item.weingut)}) <span class="badge badge-custom-${item.type}">${escape(item.type)}</span> <span class="badge badge-secondary">${escape(item.jahr)}</span></p></div>`;
          }
        },
        onItemAdd: function(value, $item) {
          window.location.href = "flasche.html?id="+value;
        },
        create: false
      });

    }
  });

});
