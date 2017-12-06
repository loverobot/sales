;(function($, window, document, undefined){
    'use strict';

    var page = {
        dialog: $('#package-form'),
        fillForm: function(data){
            var form = page.dialog;

            $.each(data, function(k, v){
                var item = null;
                item = form.find('p.'+ k);
                item.text(v);
            });
        },
        init: function(){
            var self = page;

            $('body').on('click', '.mj-detail', function(){
                var val = $(this).data('values');
                if(!$.isEmptyObject(val)){
                    self.fillForm(val);
                    page.dialog.modal('show');
                }
            });
        }
    };

    $(document).ready(page.init);
})(jQuery, window, document);
