const $ = require('jquery');

(() => {
    const elem = document.getElementById('wait-modal');
    const modal = M.Modal.getInstance(elem);

    $('[name=image-btn]').on('click', function() {
        $('input[type=file]').trigger('click');
    });

    $('#file').on('change', function() {
        const fd = new FormData();
        const target = $('#file').get(0);
        fd.append('file', target.files[0]);

        $('#wait-modal .determinate').attr('style', 'width: 0%');
        modal.open();
        $('#img-block').hide();
        $('#loader').show();

        $.ajax({
            type: 'POST',
            url: '../upload',
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                const XHR = $.ajaxSettings.xhr();
                if (XHR.upload) {
                    XHR.upload.addEventListener('progress', function(e) {
                        const progress = parseInt(e.loaded / e.total * 100);
                        $('#wait-modal .determinate').attr('style', 'width:' + progress + '%');
                    });
                }
                return XHR;
            }
        }).done(function(response) {
            console.log(response);
            $('input[name=doc_id]').val(response.doc_id);
            $('#menu-img').attr('src', '/doc/' + response.doc_id);
        }).fail(function(response) {
            console.log(response);
            if (!response.responseText) {
                alert('アップロードが中断されました');
                return false;
            }
        }).always(function() {
            $('#loader').hide();
            $('#img-block').show();
            modal.close();
        });
    });

    $('#main-form').on('submit', () => {
        if ($('input[name=doc_id]').val().length === 0) {
            alert('require image');
            return false;
        }
        if ($('textarea[name=json]').val().length === 0) {
            alert('require json');
            return false;
        }
    });
})();
