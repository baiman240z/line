const $ = require('jquery');

(() => {
    $('.edit-btn').on('click', function() {
        const id = $(this).closest('li').attr('audience-id');
        location.href = 'audience?id=' + id;
    });

    $('.delete-btn').on('click', function() {
        if (confirm('Are you sure?')) {
            const form = $('#delete-form');
            form.find('input[name=id]').val($(this).closest('li').attr('audience-id'));
            form.submit();
        }
    });
})();
