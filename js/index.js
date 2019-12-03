function getData() {
    var html = '';
    //设置同步请求
    $.ajaxSettings.async = false;
    $.ajax({
        url: "https://api.apiopen.top/musicBroadcasting",
        type: 'GET',
        dataType: "json",
        data: {},
        success: function (data) {
            if (data && data.result[0] && data.result[0].channellist) {
                data.result[0].channellist.map(function (value, index, arr) {
                    html += '<div class="list-item"><img src="' + value.thumb + '" style="width: 100%;" alt=""><span>' + value.name + '</span></div>';
                });
            }
        }
    });
    return html;
}

window.onload = function () {
    var html = getData();
    $('.content-list').each(function () {
        $(this).html(html);
    });

    // 虚拟位置
    var nav_height = $('.nav_bar').outerHeight();
    $('.hidden_nav').each(function () {
        $(this).css({ 'top': '-.1rem' });
        // $(this).css({ 'top': -(nav_height * .4 - 5) });
    });

    var nav = new navigation({
        container: "#container",
        nav_bar: "#nav_bar",
        "ele_width": 150
    });
}