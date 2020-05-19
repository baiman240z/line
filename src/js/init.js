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

    $('#channel-selector').on('change', function() {
        $.post('/channel', {channel: $(this).val()}).done((response) => {
            location.reload();
        }).fail((response) => {
            console.log(response);
        });
    });

    $('.setting-btn').on('click', () => {
        const elem = document.getElementById('setting-modal');
        const modal = M.Modal.getInstance(elem);
        modal.open();
        return false;
    });
})();
