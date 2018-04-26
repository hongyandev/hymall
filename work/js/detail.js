
$(function () {
    detail("goodsId");
});

function detail(goodsIdVal) {
    var detailURL = window.location.search;
    if(detailURL.indexOf(goodsIdVal)!=-1){
        var pos_start = detailURL.indexOf(goodsIdVal) + goodsIdVal.length + 1;
        var pos_end = detailURL.indexOf("&", pos_start);
        if(pos_end==-1){
            goodsId=detailURL.substring(pos_start);
            $.ajax({
                type:'post',
                url:'http://sge.cn:9090/erp/api/goodsInfo',
                data:{"goodsid":goodsId},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var img="";
                        $.each(res.data.goods.imageUrls,function (idx,val) {
                            img+=" <li class=\"swiper-slide\"><img src='"+val+"?x-oss-process=image/resize,l_400'/> </li>"
                        })
                        $(".swiper-wrapper").html(img);
                        var swiper = new Swiper('.swiper-container', {
                            pagination: {
                                el: '.swiper-pagination',
                                type: 'fraction',
                            },
                        });
                        var detailTit="<h3 class=\"font18\">"+res.data.goods.goodsName+"</h3>\n" +
                            "    <div><span class=\"font14\">积分 </span><b class=\"font_red font18\">"+res.data.goods.integral+"</b></div>";
                        $(".detailTit").html(detailTit);

                        var standard="<span class=\"font14 fle\">规格：<b class=\"font16\">"+res.data.goods.goodsType+"</b></span>\n" +
                            "    <span class=\"font14 fri\">库存：<b class=\"font16\">"+res.data.goods.qty+"</b></span>"
                        $(".standard").html(standard);

                        var explains=" <p>"+res.data.goods.explains+"</p>"
                        $(".detailCon").html(explains);

                        var flImg="<img src='"+res.data.goods.imageUrls[0]+"?x-oss-process=image/resize,l_100'/>"
                        $(".flImg").html(flImg);

                        $(".flIntegral").html(res.data.goods.integral);
                        $(".flStandard").html(res.data.goods.goodsType);
                    }
                }
            });
        }
    }
}

//加入购物车
$(function () {
    $(".closeIcon").on("click",function(){
        $(".flBrief").fadeOut();
    });
    $("#addPro").on("click",function () {
        $(".flBrief").fadeIn();

    });
    $("#buyIcon").on("click",function () {
        $(".flBrief").fadeIn();
    })
    $(".sureBtn").on("click",function (e) {
        var num=parseInt($(".shopNum .num").text());
        $.ajax({
            type: 'POST',
            url: 'http://sge.cn:9090/erp/api/updateCartGoods',
            data: {
                'userid': $.cookie("userid"),
                'goodsid': goodsId,'qty':num
            },
            success: function(data){
                if(data.code<0){
                    alert('添加失败！');
                }else {
                    //alert("已添加至购物车");
                    //console.info(goodsId)
                    $(".flAlert").show().fadeOut(2000);
                }
            },
            error: function(){
                alert('添加购物车商品出错！请检查响应消息！');
            }
        });
        $(".flBrief").fadeOut();

    })
})





