// ;防止跟其他js压缩时报错
; (function (window, document) {
    // 开启严格模式
    "use strict";

    function navigation(options) {
        var self = this;
        if (!options) {
            throw new Error("请传入配置参数");
        }
        self = Object.assign(self, options);
        self.nav_bar = document.querySelector(self.nav_bar) || document.querySelectorAll(self.nav_bar);
        self.container = document.querySelector(self.container) || document.querySelectorAll(self.container);
        self.ele_width = self.ele_width;

        self.navInit(self.nav_bar, self.container, window);
        self.onScrollVertical(self.nav_bar, window);
        self.onScrollLevel(self.nav_bar, self.ele_width, window);
        self.navClick(self.nav_bar);
    }

    // 原型链上提供的方法
    navigation.prototype = {
        // 导航栏点击事件
        navInit: function (ele_nav, ele_container, window) {
            // 遍历页面虚拟坐标,并为其添加index,保存其坐标位置
            self.temlist = [];
            $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                $(element).addClass('hidden_nav');
                $(element).attr('data-navIndex', index);
                self.temlist.push($(element).offset().top);
            });
            // 遍历导航栏按钮,并为其添加index,保存其坐标位置
            self.temNavList = [];
            $(ele_nav).children().eq(0).find('.nav_bar_item').each(function (index, element) {
                $(element).attr('data-navIndex', index);
                self.temNavList.push($(element).width());
            });
            // 监听滚动事件,更新虚拟坐标位置
            $(window).scroll(function () {
                self.temlist = [];
                $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                    $(element).attr('data-navIndex', index);
                    self.temlist.push($(element).offset().top);
                });
            });
        },
        // 导航栏水平滑动
        onScrollLevel: function (ele_nav, ele_width, window) {
            // 监听滚动事件,更新导航栏按钮位置坐标,并使当前按钮在可视范围内
            $(window).scroll(function () {
                self.temNavList = [];
                var activityIndex = null;
                activityIndex = Number($('.linkActive').eq(0).attr('data-navIndex')) + 1;
                if (activityIndex != null) {
                    // $(ele_nav).children().eq(0).scrollLeft((activityIndex - 1) * ele_width);
                    var timer = setTimeout(function () {
                        $(ele_nav).children().eq(0).stop().animate({
                            scrollLeft: (activityIndex - 1) * ele_width + 'px'
                        }, 'fast', 'linear');
                        clearTimeout(timer);
                    }, 100);
                }
            });
        },
        // 内容竖直方向滑动
        onScrollVertical: function (ele_nav, window) {
            // 监听滚动事件
            $(window).scroll(function () {
                var top = $(window).scrollTop();
                if (top >= ($(ele_nav).prev().outerHeight() + $(ele_nav).prev().offset().top)) {
                    $(ele_nav).css({ 'position': 'fixed', 'top': '0', 'z-index': 99 });
                    self.temlist.map(function (value, index, arr) {
                        // 10为设置的多的偏移量,防止刚刚好滑到这个地方时出错
                        if (value <= top + $(ele_nav).outerHeight()) {
                            if (index != arr.length - 1) {
                                if (self.temlist[index + 1] > top + $(ele_nav).outerHeight()) {
                                    $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
                                }
                            } else {
                                $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
                            }
                        }
                    });
                } else {
                    $(ele_nav).css({ 'position': 'relative', 'top': 'auto', 'z-index': 9 });
                    $($(ele_nav).children().eq(0).find('.nav_bar_item')[0]).addClass('linkActive').siblings().removeClass('linkActive');
                }
            });
        },
        navClick: function (ele_nav) {
            // 为导航栏按钮添加点击事件
            $(ele_nav).children().eq(0).find('.nav_bar_item').on('click', function () {
                var obj = $(this);
                var temlocation;
                if (obj.attr('data-navIndex') == 0) {
                    temlocation = 0;
                } else {
                    temlocation = self.temlist[Number(obj.attr('data-navIndex'))] - $(ele_nav).outerHeight() + 5;
                }
                var timer = setTimeout(function () {
                    $('body,html').stop().animate({
                        scrollTop: temlocation
                    }, 'fast', 'linear');
                    clearTimeout(timer);
                }, 500);
            });
        }
    }

    // 兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = navigation;
    };

    // 兼容AMD/CMD规范
    if (typeof define === 'function') define(function () {
        return navigation;
    });

    // 注册全局变量,兼容使用script标签引入插件
    window.navigation = navigation;
})(window, document);