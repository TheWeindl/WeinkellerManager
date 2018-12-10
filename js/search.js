$(document).ready(function() {

});

$("#search-box").selectize({
    valueField: 'url', // value, also wenn man auf das result click, der "ID" des Feldes zB valueField= flaschen_ID; labelField = flaschen_name;
    labelField: 'title', // LAbel, welches standardmäßig als result angezeigt wird
    searchField: ['title', 'url', 'description'], // felder die bei der eingabe durchsucht werden
    options: [],
    render: {
        option: function (item, escape) {
            return escape(item);
        }
    },
    create: false,
    load: function (query, callback) {
        //console.log(query);
        if (!query.length) return callback();
        $.ajax({
            url: '../php/Weinkeller.php',
            type: 'GET',
            data: {
                q: query
            },
            error: function () {
                callback();
            },
            success: function (response) {
                let result = [];

                $.each(response.data.children, function (key, value) {
                    // format data for corret format specified in the selectize options above
                    result[key] = {
                        title: value.data.title,
                        url: value.data.url,
                        id: value.data.id,
                        description: value.data.public_description,
                        icon: value.data.icon_img
                    };
                });
                callback(result);
            }
        });
    }
});
