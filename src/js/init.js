const $ = require('jquery');
const M = require('materialize-css');

(() => {
    M.AutoInit();
    $('#channel-selector').on('change', function() {
        $.post('/channel', {channel: $(this).val()}).done((response) => {
            console.log(response);
            location.reload();
        }).fail((response) => {
            console.log(response);
        });
    });
})();
