function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

$(function () {
    var urlRequest = GetRequest();
    var uid = urlRequest.uid;
    var aid = urlRequest.id;
    $.ajax({
        type:'get',
        url:'https://wx.hongyancloud.com/wxDev/sellactivity/getSellActivity?id='+aid+'&uid='+uid,
        success:function (res) {
            if (res.code == '00000') {
                $("#comTitle").append(res.data.title);
            }
        }
    });

    $(".submit").on("click",function () {
        var comments = $('#comment').val();
        $.ajax({
            type:'post',
            url:'https://wx.hongyancloud.com/wxDev/sellactivity/writeComment',
            data:{
                id:aid,
                uid:uid,
                comment:comments
            },
            success:function (res) {
                if (res.code == '00000') {
                    location.href='ajDetail.html?id='+aid+'&uid='+uid
                }
            }
        })
    })

});