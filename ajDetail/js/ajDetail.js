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
var urlRequest = GetRequest();
var uid = urlRequest.uid;//180309090532;//
var aid = urlRequest.id;//58;//
$(function () {
    $.ajax({
        type:'get',
        url:'https://wx.hongyancloud.com/wxDev/sellactivity/getSellActivity?id='+aid+'&uid='+uid,
        success:function (res) {
            if (res.code == '00000') {
                console.info(res.data);
                $("#filePath").val(res.data.fileRealPath);
                $(".ajTitle").html(res.data.title);
                $(".weui-article time").html(res.data.createDate);
                $(".ajContent").html(res.data.content);
                $(".reads").html(res.data.reads);
                $(".zan").html(res.data.zan);
                if (res.data.zans == '1') {
                    $(".artZan").addClass('zanActive')
                } else {
                    if (res.data.zan == '0') {
                        $(".artZan em").html("")
                    }
                    $(".artZan").removeClass('zanActive')
                }
                var str = '';
                for (var i = 0; i < res.data.lists.length; i++) {
                    str += '<li class="weui-cell">' +
                        '            <div class="weui-cell__hd" style="position: relative;margin-right: 10px;">' +
                        '                <i class="iconfont icon-yonghutouxiang" style="font-size:35px;color:#888"></i>' +
                        '            </div>' +
                        '            <div class="weui-cell__bd">' +
                        '                <p class="weui_comment">' +
                        '                    <label comid=' + res.data.lists[i].commentId + '>' + res.data.lists[i].name + '</label>';
                    if (res.data.lists[i].zans == '1') {
                        str += '<i id='+"comZan_"+i+' comzan=' + res.data.lists[i].zan + ' class="comZan iconfont  icon-zan zanActive"><em>' + res.data.lists[i].zan + '</em></i>';
                    } else {
                        if(res.data.lists[i].zan=='0'){
                            str += '<i id='+"comZan_"+i+'  comzan=' + res.data.lists[i].zan + ' class="comZan iconfont icon-zan"><em></em></i>';
                        }else{
                            str += '<i id='+"comZan_"+i+'  comzan=' + res.data.lists[i].zan + ' class="comZan iconfont icon-zan"><em>' + res.data.lists[i].zan +'</em></i>';
                        }


                    }
                    str += '                </p>' +
                        '                <p class="font13">' +
                        '                    <span>' + res.data.lists[i].comment + '</span>' +
                        '                </p>' +
                        '            </div>' +
                        '        </li>'
                }
                $(".comLists").html(str);

                $(".com").on('click',function () {
                    location.href='comment.html?id='+aid+'&uid='+uid
                });

                var artzan = res.data.zan;
                $(".artZan").on("click", function () {
                    if (artzan == '0') {
                        artzan = '1';
                        $(".artZan").addClass('zanActive');
                    } else {
                        artzan = '0';
                        $(".artZan").removeClass('zanActive');
                    };
                    $.ajax({
                        type: 'get',
                        url: 'http://wx.hongyancloud.com/wxDev/sellactivity/sellActivityZan?id=' + aid + '&uid=' + uid + '&zan=' + artzan,
                        success: function (res) {
                            if (res.code == '00000') {
                                console.info(res.data.count);
                                if (res.data.count == 0) {
                                    $(".artZan .zan").html('');
                                } else {
                                    $(".artZan .zan").html(res.data.count);
                                }


                            }
                        }
                    })

                });

                for(var i=0;i<res.data.lists.length;i++){
                    var comzan = res.data.lists[i].zan;
                    $("#comZan_"+i).on("click", function () {
                        var comid = $(this).siblings('label').attr('comid');
                        var _this = $(this);
                        if ($(this).hasClass('zanActive')) {
                            comzan = '0';
                            $(this).removeClass('zanActive');
                        } else {
                            comzan = '1';
                            $(this).addClass('zanActive');
                        }
                        $.ajax({
                            type: 'get',
                            url: 'http://wx.hongyancloud.com/wxDev/sellactivity/commentZan?id=' + comid + '&uid=' + uid + '&zan=' + comzan,
                            success: function (res) {
                                if (res.code == '00000') {
                                    console.info(res.data);
                                    if (res.data.count == 0) {
                                        _this.find('em').html('');
                                    } else {
                                        _this.find('em').html(res.data.count);

                                    }

                                }
                            }
                        })

                    });
                }

            }
        }

    })

});
function com() {

}

