//获取userid
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(decodeURIComponent(r[2]));return null;
}
var userid = (getQueryString('userid')!=null ? getQueryString('userid') : null);
$.cookie("userid",userid);

var page=1;
var pageSize=6;
var loading = false;

$(function () {
    $(".tabar ul li").on("click",function () {
        $(this).stop().addClass("curr").siblings().stop().removeClass("curr");
        var type=$(this).attr("type");
        page=1;
        //切换加载
        loading=false;
        $(".goodList").html("");
        getData(page,type);
    });
    //初始化加载
    getData(page,1);
    $(document.body).infinite(200);
    //上拉加载
    $(document.body).infinite(200).on("infinite", function() {
        console.log(loading);
        if(loading) return;
        loading = true;
        page=++page;
        setTimeout(function() {
            getData(page,$(".curr").attr("type"));
            loading = false;
        }, 300);
    });
});

function getData(page,type) {
    //进来时候加载
    $(".weui-loadmore").html("<i class=\"weui-loading\"></i><span class=\"weui-loadmore__tips\">正在加载</span>");

    $.ajax({
        type:"POST",
        url:"http://sge.cn/erp/api/storeHomePage",
        data: {
            "userid":$.cookie("userid"),
            "type": type,
            "pageNumber":page,
            "pagerSize":pageSize
        },
        dataType:"json",
        success:function(res){
            if(res.code==200){
                //console.info(res.data.goods.totalRow);
                var str="";
                if(res.data.goods.totalRow == '0'){
                    //console.info(res.data.goods.totalRow);
                    $(".weui-loadmore").hide();
                    str+=" <div class='empty align_center'><span>业务商品为空！</span></div>"
                    $(".goodList").html(str);
                    return;
                };
                if(res.data.goods.list.length > 0){
                    $.each(res.data.goods.list,function (index,val){
                        str+="<li>" +
                            "<a class='clear block' href='detail.html?goodsId="+val.goodsId+"'>" +
                            "<div class='picList fle'><img src='"+val.imageUrl+"?x-oss-process=image/resize,l_100'/></div>" +
                            "<div class=\"picMargins\">" +
                            "<p class='font16'>"+val.goodsName+"</p>" +
                            "<p class='jf'><b class='font_red font18'>"+val.integral+"</b><span> 积分</span></p>" +
                            "</div>" +
                            "</a>" +
                            "</li>";
                    });
                    $('.goodList').append(str);
                    $(".weui-loadmore").show();
                }

                if(res.data.goods.totalPage == page ){
                    loading=true;
                    $(".weui-loadmore").html("<span class=\"weui-loadmore__tips\">我已经到底了...</span>");
                    return;
                };

            }else {
                $(".weAlert").show();
            }

        },
        error:function(){
            alert("页面数据异常");
        }
    });
}

//详情页
function getDetail(goodsId) {
    $.ajax({
        type:'post',
        url:'http://sge.cn/erp/api/goodsInfo',
        data:{"goodsid": goodsId},
        success:function (res) {
            console.info(res);
        }
    })
}














