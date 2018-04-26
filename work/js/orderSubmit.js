$(function () {
    var createOrderData = $.cookie("createOrderData");
    //console.info(JSON.parse(createOrderData));
    createOrderData=JSON.parse(createOrderData);
    var str = "";
    $.each(createOrderData.list, function (idx, val) {
        str += "<div class=\"shopGroup orderGroup\">\n" +
            "<input type=\"hidden\" name=\"code\" value='"+val.code+"'/>"+
            "        <div class=\"shopName orderName clear\">\n" +
            "            <h4 class=\"font14 fle\"><a href=\"#\">" + val.khmc + "</a></h4>\n" +
            "        </div>";
        str+="<ul>"
        console.info(val);
        $.each(val.detail,function (idx,goods) {
            str+="<li>" +
                "<div class=\"shopCon orderCon\">\n" +
                "<div class=\"shopImg\"><a href=\"#\"><img src='"+goods.imageUrl+"'/></a></div>\n" +
                "<div class=\"shopText\">\n" +
                "<h4>"+goods.goodsName+"</h4>\n" +
                "<div class=\"shopBrief font13\">规格：<span>"+goods.goodsType+"</span></div>\n" +
                "<div class=\"shopPrice\">\n" +
                "<div class=\"shopPices font12\">积分<b class=\"price orderPrice font14\">"+goods.integral+"</b></div>\n" +
                "<div class=\"fri font14\">×<em class=\"orderNum\">"+goods.qty+"</em></div>\n" +
                "</div>\n" +
                "</div>\n" +
                "</div>\n" +
                "</li>"
        });
        str+= "</ul>"
        str+= "<div class=\"priceTotal\">合计积分：<span class=\"shop-total-amount ShopTotal\">"+val.integralTotal+"</span></div>\n" +
            "</div>";
    });
    $(".shopping").html(str);

    //提交订单
    $(".payBtn").on("click",function () {
        var inputCodes=$("input[name='code']");
        var codes="";
        for(var i=0;i<inputCodes.length;i++){
            codes+=inputCodes.val()+",";
        }
        if(inputCodes.length>0){
            codes=codes.substring(0,codes.length-1);
        }
        $.ajax({
            type: 'POST',
            url: 'http://sge.cn:9090/erp/api/settlementOrder',
            data: {
                'userid': $.cookie("userid"),
                'codes':codes
            },
            success: function(res){
                console.info(res);
                //alert("订单提交成功！")
                //遍历两种订单（品牌和业务），只要有一个失败订单就弹层提示兑换失败，然后跳转我的订单页面
                $.each(res.data.list,function (index,val) {
                    //console.info(val);
                    var success=true;
                    if(val.success){
                        console.info(val.message);
                        //return;
                        window.location.href= "success.html";
                    }else{
                        jQuery(".flAlert p").html(val.message);
                        jQuery(".flAlert").show();

                    }
                });

            }
        });
    })
});