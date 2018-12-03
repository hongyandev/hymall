//获取userid
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(decodeURIComponent(r[2]));return null;
}
var userid = (getQueryString('userid')!=null ? getQueryString('userid') : null);
$.cookie("userid",userid);

//订单切换
var page=1;
var pageSize=5;
var loading = false;
$(function () {
    $(".orderTab ul li").on("click",function () {
        $(this).stop().addClass("curr").siblings().stop().removeClass("curr");
        var status=$(this).attr("status");
        page=1;
        //切换加载
        loading=false;
        $(".orderList").html("");
        getOrders(page,status);

    });
    //初始化加载
    getOrders(page,$(".curr").attr("status"));

    //上拉加载
    $(document.body).infinite().on("infinite", function() {
        console.log(loading);
        if(loading) return;
        loading = true;
        page=++page;
        setTimeout(function() {
            getOrders(page,$(".curr").attr("status"));
            loading = false;
        }, 300);

    });
});
//获取订单数据
function getOrders(page,status){
    //进来时候加载
    $(".weui-loadmore").html("<i class=\"weui-loading\"></i><span class=\"weui-loadmore__tips\">正在加载</span>");

    $.ajax({
        type:"POST",
        url:"http://sge.cn/erp/api/queryOrder",
        data:{
            "userid":$.cookie("userid"),
            "status":status,
            "pageNumber":page,
            "pageSize":pageSize
        },
        dataType:"JSON",
        success:function (res) {
            if(res.code==200){
                var str="";
                var status="";
                //console.info(res.data.order.list.length);
                if(res.data.order.totalRow == 0){
                    console.info(res.data.order.totalRow);
                    $(".weui-loadmore").hide();
                    str+=" <div class='empty align_center'><span>您还没有订单哦！</span></div>"
                    $(".orderList").append(str);
                    return;
                };
                if(res.data.order.list.length > 0){
                    $.each(res.data.order.list,function(idx,val){
                        if(val.status==0){
                            status="未提交";
                        }else if(val.status==1){
                            status="未确认";
                        }else if(val.status==2){
                            status="已确认";
                        }else if(val.status==3){
                            status="已关闭";
                        }
                        var codes="";
                        str+="<div class='shopGroup orderGroup'>" +
                                "<div class='shopName orderName clear'>" +
                                    "<h4 class='font14 fle'><a href='javascript:void(0)'>"+val.khmc+"</a></h4>" +
                                    "<span class='fri'>"+status+"</span>" +
                            "</div>";
                        str+="<ul>";
                        $.each(val.detail,function (idx,goods) {
                            codes+=goods.code+",";
                            str+="<li>" +
                                    "<div class='shopCon orderCon'>" +
                                        "<div class='shopImg'><a href='javascript:void(0)'><img src='"+goods.imageUrl+"?x-oss-process=image/resize,l_100' /></a></div>\n" +
                                        "<div class='shopText'>" +
                                            "<h4>"+goods.goodsName+"</h4>" +
                                            "<div class='shopBrief font13'>规格：<span>"+goods.goodsType+"</span></div>" +
                                            "<div class='shopPrice'>" +
                                                "<div class='shopPices font12'>积分<b class='price orderPrice font14'>"+goods.integral+"</b></div>" +
                                                "<div class='fri font14'>×<em class='orderNum'>"+goods.qty+"</em></div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                 "</li>";
                        });
                        str+="</ul>";
                        str+="<div class=\"priceTotal clear\">\n" +
                            "            <div class=\"fle little_margins_top\">合计积分：<span class=\"orderTotal\">"+val.integralTotal+"</span></div>\n" +
                            "            <div class=\"orderBtn clear\">" ;
                        if(val.status ==0){
                            str+="<a class=\"accountBtn fri\" href=\"javascript:settlementOrder('"+val.userid+"','"+codes+"')\">结算</a>\n" ;
                            str+="<a class=\"deleteBtn fri\" href=\"javascript:delOrder('"+val.userid+"','"+val.code+"')\">删除</a>\n" ;
                        }
                        str+="</div>";
                        str+="</div>";
                        str+="</div>";
                    });
                    $(".orderList").append(str);
                    $(".weui-loadmore").show();
                   // return;
                }
                if(res.data.order.totalPage == page ){
                    loading=true;
                    $(".weui-loadmore").html("<span class=\"weui-loadmore__tips\">我已经到底了...</span>");
                    return;
                }

            }
        }
    })
}

//结算订单
function settlementOrder(userid,codes){
    $.ajax({
        type:"POST",
        url:"http://sge.cn/erp/api/settlementOrder",
        data:{
            "userid":$.cookie("userid"),
            "codes":codes
        },
        dataType:"JSON",
        success:function (res) {
            console.info(res);
            $.each(res.data.list,function (index,val) {
                //console.info(val);
                var success=true;
                if(val.success){
                    console.info(val.message);
                    //return;
                    window.location.href= "order.html";
                }else{
                    jQuery(".flAlert p").html(val.message);
                    jQuery(".flAlert").show();

                }
            });
        }
    });
};

//删除订单
function delOrder(userid,code){
    console.info(code);
    console.info(userid);
    $(".delBtn").on("click",function(){
        $.ajax({
            type:"POST",
            url:"http://sge.cn/erp/api/delOrder",
            data:{
                "userid":userid,
                "code":code
            },
            dataType:"JSON",
            success:function (res) {
                console.info(res);
                window.location.href=window.location.href;
            }
        })
    })

}
