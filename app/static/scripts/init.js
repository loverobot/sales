;(function($, window, document, undefined){
    'use strict';
    
    $(document).ready(function(){
        //copyRight
        $('.js-copy-right-year').copyRight();
        
        //时间日历控件
        $('.mj-date').datetimepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'bottom-left',
            minView: '2'
        });
        
        //时间日历控件
        $('.mj-month').datetimepicker({
            format: 'yyyy-mm',
            language: 'zh-CN',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'bottom-left',
            minView: '3',
            startView: '3'
        });

        //时间日历控件
        $('.mj-time').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-CN',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'bottom-left'
        });
        
        //菜单交互
        $('.mj-nav').on('click', 'h3', function(){
            var item = $(this).next();
            if(item.is(':hidden')){
                item.show();
            } else {
                item.hide();
            }
        });

        //修改密码
        $('.mj-edit-user-pw').on('click', function(){
            $('#mj-edit-userpw-dialog').modal('show');
        });
        //验证
        $('#mj-edit-userpw-form').validate({
            rules: {
                password: {
                    required: true
                },
                password_new: {
                    required: true
                },
                password_again: {
                    required: true,
                    equalTo: '#mj-edit-userpw-form-3'
                }
            },
            messages: {
                password: {
                    required: '请输入旧密码'
                },
                password_new: {
                    required: '请输入新密码'
                },
                password_again: {
                    required: '请输入确认密码',
                    equalTo: '两次密码输入不一致'
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
        
        //填充初始数据
        var mojingFillForm = function(){
            var form = $('.mj-fill-input');
            if(form.length > 0){
                $.each(form.find('input, select'), function(){
                    var v = $(this).data('value');
                    if(v){
                        $(this).val(v);
                    }
                });   
            }
        };
        mojingFillForm();
        
        //删除前确认
        $('body').on('click', '.mj-confirm-link', function(){
            var href = $(this).attr('href');
            BootstrapDialog.confirm({
                type: BootstrapDialog.TYPE_DEFAULT,
                size: BootstrapDialog.SIZE_SMALL,
                title: '系统提示',
                message: '请确认是否执行此操作？',
                btnCancelLabel: '取消',
                btnOKLabel: '确定',
                btnOKClass: 'btn-primary',
                closable: true,
                callback: function(type){
                    if(type){
                        window.location.href = href;
                    }    
                }
            });
            return false;
        });
        
    });
})(jQuery, window, document);
