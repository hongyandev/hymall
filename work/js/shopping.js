//获取userid
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(decodeURIComponent(r[2]));return null;
}
var userid = (getQueryString('userid')!=null ? getQueryString('userid') : null);
$(function () {
    $.ajax({
        type:"POST",
        url:"http://sge.cn/erp/api/cartItems",
        data:{
              "userid":$.cookie("userid")
          },
        dataType:"json",
        success:function(res){
            if(res.code==200){
                //console.info($.cookie("userid"));
                var str="";
                if(res.data.cartItems){
                    $.each(res.data.cartItems,function (indx,val) {
                        str+="<div class=\"shopGroup\">"+
                                "<div class=\"shopName clear\">\n" +
                                "    <input type=\"checkbox\" class=\"check shopCheck\">\n" +
                                "    <h4 class=\"font14 khmc fle\"><a href=\"#\">"+res.data.cartItems[indx].khmc+"</a></h4>\n" +
                                "</div>";
                                str+="<ul>";
                                $.each(val.cartItem,function(indx,goods) {
                                    str+="<li value='"+goods.goodsId+"'>" +
                                        "                 <div class='shopCon'>" +
                                        "                     <input type='checkbox' class='check goodsCheck' value='"+goods.goodsId+"'>" +
                                        "                     <div class=\"shopImg\"><a href=\"#\"><img src='"+goods.imageUrl+"?x-oss-process=image/resize,l_100' /></a></div>\n" +
                                        "                     <div class=\"shopText\">" +
                                        "                         <div class=\"shoptit\">" +
                                        "                             <h4>"+goods.goodsName+"</h4>" +
                                        "                             <div class=\"shopBrief font12\">规格：<span>"+goods.goodsType+"</div>" +
                                        "                             <a class='deletedIcon' href='javascript:void(0)'></a>"+
                                        "                         </div>" +
                                        "                         <div class=\"shopPrice\">" +
                                        "                             <div class=\"shopPices font12\">\积分<b class='price font14'>"+goods.integral+"</div>" +
                                        "                             <div class=\"shopNum\">" +
                                        "                                 <a href=\"javascript:void(0);\" class=\"minus\" goodsId='"+goods.goodsId+"'>－</a>" +
                                        "                                 <span class=\"num\" >"+goods.qty+"</span>" +
                                        "                                 <a href=\"javascript:void(0);\" class=\"plus\" goodsId='"+goods.goodsId+"'>+</a>" +
                                        "                             </div>" +
                                        "                         </div>" +
                                        "                     </div>" +
                                        "                 </div>" +
                                        "</li>";
                                });
                                str+="</ul>";
                                str+="<div class='priceTotal'>合计积分：<span class='shop-total-amount ShopTotal'>0</span></div>";
                        str+="</div>";
                    });
                    $(".shopping").html(str);
                }

            }
        }
    });


    //立即兑换
    $(".payBtn").on("click",function () {
        var goodsInput=$(".goodsCheck:checked");
        var goodsId="";
        for(var i=0;i<goodsInput.length;i++){
            goodsId+=$(goodsInput[i]).val()+",";
        }
        if(goodsInput.length>0){
            goodsId=goodsId.substring(0,goodsId.length-1);
        }
        $.ajax({
            type:"POST",
            url:"http://sge.cn/erp/api/createOrder",
            data:{
                "userid":$.cookie("userid"),
                "goodsids":goodsId
            },
            dataType:"json",
            success:function (res) {
                if(res.code==200){
                    $.cookie('createOrderData',JSON.stringify(res.data));
                    window.location.href="orderSubmit.html";
                }
            }
        });
    })
    //删除
    $(document).on("click",".deletedIcon",function () {
        $(".floating").show();
        var goodsId=$(this).parents("li").attr("value");
        console.info(goodsId);
        $(".delBtn").on("click",function () {
            console.info(goodsId);
            $.ajax({
                type:"POST",
                url:"http://sge.cn/erp/api/updateCartGoods",
                data:{
                    "userid":$.cookie("userid"),
                    "goodsid":goodsId,
                    "qty":0
                },
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        //$.cookie('createOrderData',JSON.stringify(res.data));
                        window.location.href=window.location.href;

                    }
                }
            });
        });


    });

});



$(function () {
    /*数量减*/
    $(document).on("click",".minus",function () {
        var t = $(this).parent().find(".num");
        console.info(t);
        var goodIds=$(this).attr("goodsid");
        var qty=parseInt(t.text()) - 1
        t.text(qty);
        if(t.text()<=1){
            t.text(1);
        }
        TotalPrice();
        updateCartGoods(goodIds,qty);

    });
    /*数量加*/
    $(document).on("click",".plus",function(){
        var t = $(this).parent().find(".num");
        var goodIds=$(this).attr("goodsid");
        var qty=parseInt(t.text()) + 1
        t.text(qty);
        if(t.text()<=1){
            t.text(1);
        }
        TotalPrice();
        updateCartGoods(goodIds,qty);
    });

    /*点击商品按钮*/
    $(document).on("click",".goodsCheck",function () {
        var allGoods = $(this).closest(".shopGroup").find(".goodsCheck");
        var allGoodsC = $(this).closest(".shopGroup").find(".goodsCheck:checked");
        var shopsCheck = $(this).closest(".shopGroup").find(".shopCheck");
        if (allGoods.length == allGoodsC.length) { //如果选中的商品等于所有商品
            shopsCheck.prop('checked', true); //店铺全选按钮被选中
            if ($(".shopCheck").length == $(".shopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
                $("#allCheck").prop('checked', true); //全选按钮被选中
                TotalPrice();
            } else {
                $("#allCheck").prop('checked', false); //else全选按钮不被选中
                TotalPrice();
            }
        } else { //如果选中的商品不等于所有商品
            shopsCheck.prop('checked', false); //店铺全选按钮不被选中
            $("#allCheck").prop('checked', false); //全选按钮也不被选中
            // 计算
            TotalPrice();
        }

    });
    // 点击店铺按钮
    $(document).on("click",".shopCheck",function() {
        if ($(this).prop("checked") == true) { //如果店铺按钮被选中
            $(this).parents(".shopGroup").find(".goodsCheck").prop('checked', true); //店铺内的所有商品按钮也被选中

            if ($(".shopCheck").length == $(".shopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
                $("#allCheck").prop('checked', true); //全选按钮被选中
                TotalPrice();
            } else {
                $("#allCheck").prop('checked', false); //else全选按钮不被选中
                TotalPrice();
            }
        } else { //如果店铺按钮不被选中
            $(this).parents(".shopGroup").find(".goodsCheck").prop('checked', false); //店铺内的所有商品也不被全选
            $("#allCheck").prop('checked', false); //全选按钮也不被选中
            TotalPrice();
        }
    });
    //点击全选按钮
    $(document).on("click","#allCheck",function () {
        if ($(this).prop("checked") == true) { //如果全选按钮被选中
            $(".check").prop('checked', true); //所有按钮都被选中
            TotalPrice();
        } else {
            $(".check").prop('checked', false); //else所有按钮不全选
            TotalPrice();
        }
        $(".shopCheck").change(); //执行店铺全选的操作
    });

    /*计算值*/
    function TotalPrice() {
        var allprice = 0; //总价
        $(".shopGroup").each(function() { //循环每个店铺
            var oprice = 0; //店铺总价
            $(this).find(".goodsCheck").each(function() { //循环业务和品牌里面的商品
                if ($(this).is(":checked")) { //如果该商品被选中
                    var num = parseInt($(this).parents(".shopCon").find(".num").text()); //得到商品的数量
                    var price = parseInt($(this).parents(".shopCon").find(".price").text()); //得到商品的单价
                    var total = price * num; //计算单个商品的总价
                    oprice += total; //计算该店铺的总价
                }
                $(this).closest(".shopGroup").find(".ShopTotal").text(oprice); //显示被选中商品的总价
            });
            var oneprice = parseInt($(this).find(".ShopTotal").text()); //得到每个的总价
            allprice += oneprice; //计算所有的总价
        });

        $("#AllTotal").text(allprice); //输出全部总价
    }


});


/*订单合计*/
$(function () {
    var orderprice = parseInt($("#orderPrice").text());
    var ordernum = parseInt($("#orderNum").text());
    var ordertotal = orderprice*ordernum;
    $(".orderTotal").text(ordertotal);
})

function updateCartGoods(goodsid,qty) {
   // console.info(typeof (qty))
    $.ajax({
        type:"POST",
        url:"http://sge.cn/erp/api/updateCartGoods",
        data:{
            "userid":$.cookie("userid"),
            "goodsid":goodsid,
            "qty":qty
        },
        dataType:"json",
        success:function (res) {
            if(res.code==200){
                //window.location.href= window.location.href;

            }
        }
    });
}





