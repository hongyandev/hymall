function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(decodeURIComponent(r[2]));return null;
}
var userid = (getQueryString('userid')!=null ? getQueryString('userid') : null);
$.cookie("userid",userid);
$(function () {

    $(".intType li.active").on("click",function () {
        var type = $(this).attr("rtype");
        var month = $('select option:selected').val();
        month=month.replace("年","-").replace("月","");

        window.location.href="http://172.30.8.90/jifen/integralList?userid="+$.cookie("userid")+"&khdm=41050021&month="+month+"&rtype="+type+"";

    })
    
});
