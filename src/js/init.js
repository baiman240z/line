const $ = require('jquery');
const M = require('materialize-css');

(() => {
    M.AutoInit();

    $('.copy-clip').on('click', function() {
        const text = $(this).text();
        $('#copy-boad').text(text).show().select();
        document.execCommand('copy');
        $('#copy-boad').hide();
        M.toast({html: 'Copied "' + text + '"'});
    });

    $('#setting-form').on('submit', function() {
        $.post('/setting', $(this).serializeArray()).done((response) => {
            location.reload();
        }).fail((response) => {
            console.log(response);
        });
        return false;
    });

    $('.setting-btn').on('click', () => {
        const elem = document.getElementById('setting-modal');
        const modal = M.Modal.getInstance(elem);
        modal.open();
        return false;
    });

    $('.flash-message').each(function() {
        M.toast({html: $(this).text()});
    });
})();
