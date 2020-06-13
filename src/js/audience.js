const $ = require('jquery');

(() => {
    $('#main-form').on('submit', function() {
        const description = $(this).find('input[name=description]').val();
        if (description.length === 0) {
            M.toast({html: 'Description required'});
            return false;
        }
        const audiences = $(this).find('textarea[name=audiences]').val();
        const id = $(this).find('input[name=id]').val();
        if (audiences.length === 0 && !id) {
            M.toast({html: 'LINE ID required'});
            return false;
        }
    });
})();
