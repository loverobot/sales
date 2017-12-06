;(function($, window, document, undefined){
    'use strict';

    var page = {
        form: $('#grouplist-add-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    group_name: {
                        required: true
                    }
                },
                messages: {
                    group_name: {
                        required: '请输入角色名称'
                    }
                },
                highlight: function(element){
                    var item = $(element).closest('.form-group');
                    item.addClass('has-error');
                },
                unhighlight: function(element){
                    var item = $(element).closest('.form-group');
                    item.removeClass('has-error');
                }
            });
        },
        init: function(){
            var self = page;
            self.valid();
        }
    };

    $(document).ready(page.init);
})(jQuery, window, document);
