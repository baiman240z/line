const $ = require('jquery');

(() => {
    $('.delete-btn').on('click', function() {
        if (confirm('Are you sure?')) {
            const form = $('#delete-form');
            form.find('input[name=id]').val($(this).closest('li').attr('menu-id'));
            form.submit();
        }
    });

    $('.default-btn').on('click', function() {
        const form = $('#default-form');
        form.find('input[name=id]').val($(this).closest('li').attr('menu-id'));
        form.submit();
    });

    $('.detail-btn').on('click', function() {
        const elem = document.getElementById('detail-modal');
        const modal = M.Modal.getInstance(elem);

        $.getJSON(
        'json', {id: $(this).closest('li').attr('menu-id')}
        ).done((response) => {
            $('#detail-modal img').attr('src', '/richmenu/image?id=' + response['richMenuId']);
            $('#detail-modal pre.menu').text(JSON.stringify(response, null, 4));
            modal.open();
        });

    });
})();
