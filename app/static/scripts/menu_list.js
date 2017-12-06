;(function($, window, document, undefined){
    'use strict';
    
    var page = {
        dialog: $('#package-form'),
        fillForm: function(data, title){
            var form = page.dialog;
            title = title ? title : '添加菜单';
            
            $.each(data, function(k, v){
                var item = null;
                if(k === 'viewcode'){
                    item = form.find('input[name="'+ k +'"][value="'+ v +'"]');
                    item.prop('checked', true);
                } else {
                    item = form.find('input[name="'+ k +'"]');
                    item.val(v);
                }
            });
            
            $('#my-modal-label').text(title);
        },
        valid: function(){
            var form = page.dialog.find('form');
            form.validate({
                rules: {
                    menu_name: {
                        required: true
                    },
                    menu_link: {
                        required: true
                    },
                    action_code: {
                        required: true
                    }
                },
                messages: {
                    menu_name: {
                        required: '请输入菜单名称'
                    },
                    menu_link: {
                        required: '请输入菜单链接'
                    },
                    action_code: {
                        required: '请输入展示图标'
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

            $('body').on('click', '.mj-add', function(){
                page.dialog.find('form')[0].reset();
                self.fillForm(null, '添加菜单');
                page.dialog.modal('show');
            });
            
            $('body').on('click', '.mj-edit', function(){
                var val = $(this).data('values');
                if(!$.isEmptyObject(val)){
                    self.fillForm(val, '编辑菜单');
                    page.dialog.modal('show');
                }
            });
        }
    };
    
    $(document).ready(page.init);
})(jQuery, window, document);
