const $ = require('jquery');
const M = require('materialize-css');

(() => {
    M.AutoInit();
    $('#channel-selector').on('change', function() {
        $.post('/channel', {channel: $(this).val()}).done((response) => {
            console.log(response);
        }).fail((response) => {
            console.log(response);
        });
    });
})();
