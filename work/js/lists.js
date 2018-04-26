//获取userid
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(decodeURIComponent(r[2]));return null;
}
var userid = (getQueryString('userid')!=null ? getQueryString('userid') : null);
$.cookie("userid",userid);

var page=1;
var pageSize=5;
var loading = false;

$(function () {
    $(".tabar ul li").on("click",function () {
        $(this).addClass("curr").siblings().removeClass("curr");
        var type=$(this).attr("type");
        console.info(type);
        //切换加载
        $(".goodList").html("");
        page=1;
        getData(page,type);
    });
    //初始化加载
    getData(page,1);

    //上拉加载
    $(document.body).infinite().on("infinite", function() {
        if(loading) return;
        loading = true;
        page=++page;
        setTimeout(function() {
            getData(page,$(".curr").attr("type"));
            loading = false;
        }, 2000);
    });
});

//详情页
function getDetail(goodsId) {
    $.ajax({
        type:'post',
        url:'http://sge.cn:9090/erp/api/goodsInfo',
        data:{"goodsid": goodsId},
        success:function (res) {
            console.info(res);
        }
    })
}

function getData(page,type) {
    $.ajax({
        type:"POST",
        url:"http://sge.cn:9090/erp/api/storeHomePage",
        data: {
            "userid":$.cookie("userid"),
            "type": type,
            "pageNumber":page,
            "pagerSize":pageSize
        },
        dataType:"json",
        success:function(res){
            if(res.code==200){
                var str="";
                if(res.data.goods.totalRow == 0){
                    console.info(res.data.order.totalRow);
                    $(".weui-loadmore").hide();
                    str+=" <div class='empty align_center'><span>您还没有订单哦！</span></div>"
                    $(".orderList").append(str);
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
                    //console.info(res.data.goods.totalPage);
                    return;
                }
                if(res.data.goods.totalPage < page ){
                    //console.info(page);
                    loading=true;
                    $(".weui-loadmore").html("<span class=\"weui-loadmore__tips\">我已经到底了...</span>");
                    return;
                };


                /*if(res.data.goods.lastPage==false){
                    loading=false;
                    $(".weui-loadmore").html("<i class=\"weui-loading\"></i>\n" +
                        "       <span class=\"weui-loadmore__tips\">正在加载</span>");
                }else{
                    loading=true;
                    $(".weui-loadmore").html(" <span class=\"weui-loadmore__tips\">我已经到底了...</span>");
                    return;
                };*/
            }else {
                $(".weAlert").show();
            }

        },
        error:function(){
            alert("页面数据异常");
        }
    });
}















