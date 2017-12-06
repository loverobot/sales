/*!
 * jQuery 自动更新版权年份插件 v0.0.1
 *
 * 使用方法: $('.js-copy-right-year').copyRight();
 * html代码: <span class="js-copy-right-year" data-from="2005"></span>
 * 显示结果: <span class="js-copy-right-year" data-from="2005">2005-2017</span>
 */
;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
		// Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
		// Browser globals
        factory(jQuery);
    }

}(function($) {
    'use strict';
	//code here
	$.fn.copyRight = function(){
		var items = this;
        $.each(items, function(){
            var me = $(this);
            var from = me.data('from');
            var to = new Date().getFullYear();
            from = from ? from : to - 1;
            me.text(from +' - '+ to);
        });
        return this;
	};
}));
