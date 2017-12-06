;(function($, window, document, undefined){
    'use strict';

    var page = {
        form: $('#orderlist-add-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    name: {
                        required: true,
                        remote: {
                            url: '/api/group/checkName',
                            type: 'GET',
                            dataType: 'JSON',
                            data: {
                                title: function(){
                                    return form.find('[name="name"]').val();
                                }
                            },
                            dataFilter: function(respone){
                                var data = JSON.parse(respone);
                                var code = parseInt(data.code);
                                if(code === 0){
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    },
                    code: {
                        required: true
                    }
                },
                messages: {
                    name: {
                        required: '请输入产品名称',
                        remote: '产品名称已存在'
                    },
                    code: {
                        required: '请输入产品条码'
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
            page.valid();

            //autocomplete
            nosh.autocompleteInit();
            new nosh.autocomplete($('#mj-get-products'), '/manage/goods/getrelsinglesajax', function(d){
                $('#mj-get-products-info').val(JSON.stringify(d));
                $('input[name="share_price"]').val(d.price);
            });

            //辅助表单添加验证
            var f = $('#add-products');
            f.validate({
                rules: {
                    mj_get_products: {
                        required: true
                    },
                    share_price: {
                        required: true,
                        number: true,
                        min: 0
                    },
                    share_num: {
                        required: true,
                        digits: true,
                        min: 1
                    }
                },
                messages: {
                    mj_get_products: {
                        required: '产品不能为空'
                    },
                    share_price: {
                        required: '请输入产品单价',
                        number: '请输入合法的数字',
                        min: '最小值为0'
                    },
                    share_num: {
                        required: '请输入产品数量',
                        digits: '请输入正整数',
                        min: '最小值为1'
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

            var ps = $('#mj-package-list');
            var tbody = $('#mj-package-show');

            //添加产品 {"id":"1", "text":"text", "code":"code"}
            var addPs = function(d){
                var val = ps.val();
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                val.push(d);
                ps.val(JSON.stringify(val)).trigger('change');
            };

            var delPs = function(index){
                var val = ps.val();
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                val.splice(index, 1);

                val = val.length === 0 ? '' : JSON.stringify(val);
                ps.val(val).trigger('change');
            };

            var countTotal = function(){
                var f = $('#freight');
                var d = $('#discounts');
                var p = $('#payment');
                var psn = ps.data('total');
                var fn = f.val();
                var dn = d.val();
                var pn = 0;

                psn = psn ? psn : 0;
                fn = fn ? fn : 0;
                dn = dn ? dn : 0;

                pn = Decimal.add(psn, fn).sub(dn).toFixed(2);
                pn = pn > 0 ? pn : 0;

                p.val(pn);
            };
            
            var getIsEdit = function(){
                var res = false;
                if($('input[name="order_num"]')[0] && $('input[name="order_num"]').val()){
                    res = true;   
                }
                return res;
            };
            
            var isEdit = getIsEdit();

            ps.on('change', function(){
                var val = ps.val();
                var items = '';
                var total = 0;
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                $.each(val, function(k, v){
                    var s = parseInt(v.status) === 2 ? '不良品' : '良品';
                    var t = (new Decimal(v.price).mul(v.num)).toFixed(2);
                    var a = isEdit ? '&nbsp;' : '<a href="javascript:;" class="btn btn-xs btn-danger del" data-index="'+ k +'">删除</a>';
                    items += '<tr data-index="'+ k +'">'+ 
                        '    <td>'+ (k+1) +'</td>'+
                        '    <td>'+ v.text +'</td>'+
                        '    <td>'+ v.encipher +'</td>'+
                        '    <td>'+ v.code +'</td>'+
                        '    <td>'+ s +'</td>'+
                        '    <td><input class="form-control input-sm count-price-s" size="8" name="" value="'+ Number(v.price).toFixed(2) +'"></td>'+
                        '    <td><input class="form-control input-sm count-price-s" size="8" name="" value="'+ v.num +'"></td>'+
                        '    <td><input class="form-control input-sm" size="8" name="" value="'+ t +'" readonly></td>'+
                        '    <td>'+ a +'</td>'+
                        '</tr>';

                    total = new Decimal(t).plus(total);
                });

                if(!items){
                   items = '<tr><td colspan="9"><p class="text-center text-muted">暂无产品</p></td></tr>';
                }
                tbody.html(items);

                ps.data('total', total);
                countTotal();
            });
            tbody.on('click', '.del', function(){
                var index = $(this).data(index);
                delPs(index);
            });

            f.on('submit', function(){
                if(f.valid()){
                    var d = {};
                    var info = $('#mj-get-products-info').val();
                    d = JSON.parse(info);
                    d.price = $('input[name="share_price"]').val();
                    d.num = $('input[name="share_num"]').val();
                    addPs(d);
                    f[0].reset();
                }
                return false;
            });

            $('button[form="add-products"]').on('click', function(){
                f.submit();
                return false;
            });

            //计算价格
            tbody.on('input change', '.count-price-s', function(){
                var tr = $(this).closest('tr');
                var inputs = tr.find('input');
                var index = tr.data('index');
                if(inputs.length === 3){
                    var price = Number(inputs.eq(0).val()).toFixed(2);
                    var num = inputs.eq(1).val();
                    var total = 0;

                    price = Number(price) > -1 ? Number(price) : 0;
                    num = parseInt(num) > 0 ? parseInt(num) : 1;
                    total = new Decimal(price).mul(num);
                    inputs.eq(2).val(total.toFixed(2));

                    //更新数据
                    var val = ps.val();
                    val = val ? val : [];
                    val = typeof(val) === 'string' ? JSON.parse(val) : val;

                    val[index].price = price.toFixed(2);
                    val[index].num = parseInt(num);
                    val = val.length === 0 ? '' : JSON.stringify(val);
                    ps.val(val).trigger('change');
                }
            });

            $('#freight, #discounts').on('input change', function(){
                countTotal();
            });


            ps.trigger('change');

            //省市区联动
            nosh.chinaAddr.init($('.mj-china-addr'));
        }
    };

    $(document).ready(page.init);

})(jQuery, window, document);
