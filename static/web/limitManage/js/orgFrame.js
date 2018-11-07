function tissueAdmin(){
        this.init=tissueInit;
        this.incident=tissueIncident;
        this.vali=new clsValidateCtrl();
        this.rank=null;
        this.alertBox=new clsAlertBoxCtrl();
        this.sure=null;
        this.newCom=null;
        this.onThis=null;
        this.idC=null;
        this.orgId=null;
    }
    function tissueInit(){
        //this.vali=;
        //初始化调用的方法
        // /getListTreeOrgInfo
        this.orgId=$.cookie('orgId');
        var acctType=$.cookie('acctType');
        // if(acctType==0){//超级管理员？
        //     $(".left-div-two").css("display","");
        // }
        if(this.orgId.length==11){
            $('.resourceOrg').css("display","")
        }else{
            getAjaxResult("/orgInfo/getChildTreeOrgInfo","POST",{"parentId":this.orgId},"orgInfo(data)")
            $("#navigation").find("a").attr("href","javascript:;")
            this.incident();
        }
    }
    function tissueIncident(){
        var _this=this;
        //点击添加组织调用的接口
        $("#addTissue").on("click",function(){
            openWin('350', '300', 'inputAnswer', true);
            $("#addReInp").val("");
            initValidate($("#addReInpDiv")[0]);
            _this.newCom=0;
            _this.rank=1;
        })
        //添加组织点击保存调用的接口
        $("#addRe").on("click",function(){
            if(!_this.vali.validateAll4Ctrl()){
                return false;
            }
            var json={};
            switch(_this.rank){
                case 1:json.parentId=document.body.docT.orgId;break;
                case 2:json.parentId=$("#fotTable")[0].jsonData.id;break;
            }
            json.orgName=$("#addReInp").val();
            json.remark=$("#memoInp").val();

            if($("#stateInp").attr("checked")){
                json.status=1;
            }else{
                json.status=0;
            }
            if(_this.newCom==1){
                json.id=json.parentId;
                json.parentId=$("#fotTable")[0].jsonData.parentId;
                getAjaxResult("/orgInfo/saveOrgInfo","POST",json,"addReAFun(data)")
            }else if(_this.newCom==0){
                getAjaxResult("/orgInfo/addOrgInfo","POST",json,"addReAFun(data)")
            }

        })
        //根目录添加点击事件
        $(".left-div-two").on("click",function(){
            _this.rank=1;
            $("#fotTable").css("display","none");
            // $(".resourceAd-con-left a").css({"color":"#888888"});
            // $(this).css({"color":"#6390f3"});
            $(".resourceAd-con-left a").removeClass("clickColor");
            $(this).addClass("clickColor");
            //openWin('350', '200', 'inputAnswer', true);
        })
        //点击树的文字时候调用接口
        $(".resourceAd-con-left").delegate("li a","click",function(){
            if($(this).parents("#navigation").length == 1){// 判断是否是最外层组织
                $("#deleteTiss").hide();
            }else{
                $("#deleteTiss").show();
            }
            $(".left-div-two").css({"color":"#888888"})
            _this.rank=2;
            //$(this).css({"color":"#6390f3"});

            $(".resourceAd-con-left a").removeClass("clickColor");
            $(this).addClass("clickColor");

            $("#fotTable").css("display","")
            getAjaxResult("/orgInfo/getOrgInfo","post",{"id":$(this).parents('li')[0].data.id},"initTissue(data)");



            /******************角色赋权开始*******************/
            // getAjaxResult("/orgInfoType/selectOrgCompanyIdType", "post", {
            //     "orgId":$(this).parents('li')[0].data.id,
            // }, "successEchoFunc(data)");

            /*******************角色赋权结束*******************/
        })
        //点击停用和启用的时候
        $("#fotTable #stateU").on("click",function(){
            var str=null;
            _this.sure=2;
            if(parseInt($(this).attr("status"))){
                str="启用"
            }else{
                str="停用"
            }
            $(this).parents("ul")[0].jsonData.status=$(this).attr("status");
            document.body.docT.alertBox.Alert('确定'+str,"提示",1,true);
        })
        //新建
        $("#newTiss").on("click",function(){
            _this.newCom=0;
            $("#addReInp").val("");
            $("#memoInp").val("");
            $("#stateInp").attr("checked",false);
            $("#inputAnswer h2").text("新增组织");
            if(_this.rank){
                openWin('350', '300', 'inputAnswer', true);
            }else{
                document.body.docT.alertBox.Alert("请先选择组织","提示")
            }
            initValidate($("#addReInpDiv")[0]);

        })
        //删除
        $("#deleteTiss").on("click",function(){
            if(_this.rank==1){
                document.body.docT.alertBox.Alert("不可以删除根目录","提示")
            }else if(_this.rank==2){
                _this.sure=1;
                document.body.docT.alertBox.Alert("确定删除该组织","提示",1,true)
            }else{
                document.body.docT.alertBox.Alert("请先选择组织","提示")
            }
        })
        //编辑
        $("#comTiss").on("click",function(){
            _this.newCom=1;
            if(_this.rank==1){
                document.body.docT.alertBox.Alert("不可以修改根目录","提示")
            }else if(_this.rank==2){
                openWin('350', '300', 'inputAnswer', true);
            }else{
                document.body.docT.alertBox.Alert("请先选择组织","提示")
            }
            $("#inputAnswer h2").text("编辑组织");
            $("#addReInp").val($("#fotTable")[0].jsonData.orgName);
            $("#memoInp").val($("#fotTable")[0].jsonData.remark);
            if($("#fotTable")[0].jsonData.status=="1"){
                $("#stateInp").attr("checked",true);
            }else{
                $("#stateInp").attr("checked",false);
            }
            initValidate($("#addReInpDiv")[0]);
        })
        //关联
        $(".relevance").on("click",function(){
            var url="";
            switch ($(this).attr("rel")){
                case "1":url="/static/web/limitManage/html-gulp-www/userManage.html";break;
                case "2":url="/static/web/limitManage/html-gulp-www/roleManage.html";break;
                case "3":url="/static/web/limitManage/html-gulp-www/resourceManage.html";break;
            }
            window.open(encodeURI(url+"?orgId="+$(this).parents("#fotTable")[0].jsonData.id+"&orgName="+$(this).parents("#fotTable")[0].jsonData.orgName))
        })

        //查看系统引用
        $("#checkSystem").on("click",function(){
            openWin(400, 300, "resourchSeSet", true);
            $("#looptree1").empty();
            window.orgId = $(".resourceAd-con-left .clickColor").parent()[0].data.id;
            getAjaxResult("/sysInfo/selectSysInfoOrg","post",{"quoteOrgId":window.orgId},function(data){
                data = JSON.parse(data);
                if(data.retCode == "0000000"){
                    var tissueList = new treeCheck();
                    tissueList.loopLoad(
                        {
                            "data":data.rspBody,
                            "parentDom":$("#looptree1"),
                            "isNeedCheck":true,
                            "showName":["sysTitle"]
                        }
                    );
                    $("#looptree1").treeview();
                }else{
                    alert("系统错误！")
                }
                // var tissueList = new treeCheck();
                // tissueList.loopLoad(jsData.rspBody.children, $(".resourceAd-con-left"), true);
                // tissueList.unionChecked("input[type=checkbox]");
            });
        })
        $("#saveSystem").on("click",function(){
            var reqParam = {"sysIds":[],"orgId":window.orgId};
            $("#looptree1 input").each(function(i,e){
                console.log(e)
                if($(e).prop("checked")){
                    reqParam.sysIds.push($(e).parent()[0].data.sysId);
                }
            })

            getAjaxResult("/acctOrgSys/save","post",reqParam,function(data){
                data = JSON.parse(data);
                if(data.retCode == "0000000"){
                    //alert("修改成功")
                    closePopupWin();
                    var alertObj = new clsAlertBoxCtrl();
                    alertObj.Alert("修改成功","提示",true);
                }
                
            });
        });
        $("#cancelSystem").on("click",function(){
            
            closePopupWin();
        });
    }
    //页面初始化调用树的接口
    function orgInfo(data){
        var jsData=JSON.parse(data);
        if(jsData.retCode=="0000000"){
            if(jsData.rspBody.children.length){
                $(".resourceAd").css("display","block")
                var tissueList = new treeCheck();
                tissueList.loopLoad(
                    {
                        "data":jsData.rspBody.children,
                        "parentDom":$(".resourceAd-con-left"),
                        "isNeedCheck":false,
                        "showName":["orgName"]
                    }
                );
                $(".resourceAd-con-left ul").attr("id","navigation");
                $(".resourceAd-con-left ul").addClass("navigation")
                $("#navigation").treeview();
            }else{
                $(".resource").css("display","block")
            }

        }else{
            var alertBox=new clsAlertBoxCtrl();
            alertBox.Alert(jsData.retDesc,"提示");
        }
    }
    //弹框点击确定之后调用的方法
    function clsAlertBoxCtrl$sure() {
        //当对象是1的时候执行的事情
        if(document.body.docT.sure==1){
            document.body.docT.sure=0;
            // $("#fotTable")[0].jsonData;
            document.body.docT.idC=$("#fotTable")[0].jsonData.parentId;
            //删除的时候调用
            getAjaxResult("/orgInfo/removeOrgInfo","post",$("#fotTable")[0].jsonData,"deleteSure(data)");
        }else if(document.body.docT.sure==2){
            document.body.docT.sure=0;
            //停用和启用的接口
            getAjaxResult("/orgInfo/saveOrgInfo","post",$("#fotTable")[0].jsonData,"stateFun(data)");
            closePopupWin();
        }
    }
    //删除确定的时候执行的函数
    function deleteSure(data){
        var jsData=JSON.parse(data);
        if(jsData.retCode=="0000000"){
            //location.reload();
            $(".resourceAd-con-left ul").remove();
            getAjaxResult("/orgInfo/getChildTreeOrgInfo","POST",{"parentId":document.body.docT.orgId},"orgInfo(data)")
        }else{
            document.body.docT.alertBox.Alert(jsData.retDesc,"提示");
        }
    }
    //停用启用调用的接口
    function stateFun(data){
        var jsData=JSON.parse(data);
        if(jsData.retCode=="0000000"){

            getAjaxResult("/orgInfo/getOrgInfo","post",{"id":$("#fotTable")[0].jsonData.id},"initTissue(data)");
            //location.reload();
        }else{
            document.body.docT.alertBox.Alert(jsData.retDesc,"提示");
        }
    }
    $(document).ready(function () {
        var docTiss=new tissueAdmin();
        docTiss.init();
        document.body.docT=docTiss;
    });
    //时间戳转换为时间的方法
    function fmtDate(obj){
        var date =  new Date(obj);
        var y = 1900+date.getYear();
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
    }
    //树文字接口会掉函数
    function initTissue(data){
        var jsData=JSON.parse(data);
        if(jsData.retCode=="0000000"){

            for(var key in jsData.rspBody){
                if(jsData.rspBody[key]){
                    jsData.rspBody['createdTime']=fmtDate(jsData.rspBody['createdTime'])
                    $("#fotTable #"+key).text(jsData.rspBody[key]);
                }
            }
            if(parseInt(jsData.rspBody.status)){
                $("#fotTable #statusText").text("启用");
                $("#fotTable #stateU").text("停用").attr("status","0")
            }else{
                $("#fotTable #statusText").text("未启用");
                $("#fotTable #stateU").text("启用").attr("status","1")
            }

            $("#fotTable")[0].jsonData=jsData.rspBody;
            $("#fotTable").css("display","block");
        }else{
            document.body.docT.alertBox.Alert(jsData.retDesc,"提示");
        }
    }
    //添加组织点击保存调用的接口
    function addReAFun(data) {
        var jsData=JSON.parse(data);
        if(jsData.retCode=="0000000"){
            //  location.reload();
            $(".resource").css("display","none")
            //编辑完刷新表格 1是编辑 0是新建
            closePopupWin();
            document.body.docT.alertBox.Alert("保存成功","提示")

            //alert("保存成功")
            if(document.body.docT.newCom){
                $(".resourceAd-con-left ul").remove();
                getAjaxResult("/orgInfo/getOrgInfo","post",{"id":$("#fotTable")[0].jsonData.id},"initTissue(data)");
                getAjaxResult("/orgInfo/getChildTreeOrgInfo","POST",{"parentId":document.body.docT.orgId},"orgInfo(data)");
            }else{
                document.body.docT.idC=jsData.rspBody;
                $(".resourceAd-con-left ul").remove();
                getAjaxResult("/orgInfo/getChildTreeOrgInfo","POST",{"parentId":document.body.docT.orgId},"orgInfo(data)");

            }
            document.body.docT.newCom=null;


        }else{
            document.body.docT.newCom=null;
            closePopupWin();
            document.body.docT.alertBox.Alert(jsData.retDesc,"提示");
        }
    }
    // //树的渲染
    // function treeCheck(){
    //     this.data = {};
    //     this.isAllChecked = null;//该属性是否把子集全选
    // }
    // treeCheck.prototype.unionChecked = function(dom){
    //     $(dom).click(function(){

    //         for(var i=0;i<$(dom).length;i++){//后期优化
    //             // if(){
    //             // 	this.isAllChecked = false;//该属性是否把子集全选
    //             // }
    //         }
    //         //当选中或取消一个权限时，也同时选中或取消所有的下级权限
    //         $(this).siblings("ul").find("input").attr("checked",this.checked);

    //         //当选中一个权限时，也要选中所有的直接上级权限
    //         // if(this.checked ==true){
    //         //     $(this).parents("li").children("input").attr("checked",true);
    //         // }

    //         //当某一个父权限下的子权限都不选中时，该父权限也不选中
    //         var elements=$(this).parent("li").parent("ul").find("input");
    //         var num=elements.length;
    //         /*alert(num);*/
    //         var a=0;
    //         for(var i=0;i<num;i++){
    //             if(elements[i].checked==false){
    //                 a++;
    //             }
    //         }
    //         if(a==num){
    //             $(this).parent("li").parent("ul").siblings("input").attr("checked",false);
    //         }


    //     });
    // }
    // treeCheck.prototype.loopLoad = function(data, parentDom, bol){//递归,无限遍历下级dom树


    //     if(data){
    //         var oUl = document.createElement("ul");
    //         if( parentDom.attr("id") == "looptree"){
    //             oUl.id = "navigation";
    //             parentDom.append(oUl);
    //         }else{
    //             //if(!bol)oUl.style.display == "none";
    //             parentDom.append(oUl);
    //         }
    //         for(var i=0;i<data.length;i++){
    //             var oLi = document.createElement("li");
    //             var chk = "";
    //             if(data[i].isChecked){
    //                 chk = "checked";
    //             }
    //             oLi.innerHTML = "<div class='hitarea expandable-hitarea'></div><a href='javascript:;'>"+data[i].orgName+"</a>";
    //             oLi.data = data[i];
    //             if(data[i].lev == 1){
    //                 $("#navigation").append(oLi);
    //             }else{
    //                 $(oUl).append(oLi)
    //             }
    //             if(document.body.docT){
    //                 if(document.body.docT.idC){
    //                     if(data[i].id==document.body.docT.idC){
    //                         $(oLi).find("a").click();
    //                     }
    //                 }
    //             }
    //             if(data[i].children){
    //                 this.loopLoad(data[i].children, $(oLi), data[i].isChecked);
    //             }

    //         }
    //     }
    // }


/***************************组织赋权/回显 add开始********************/
function successEchoFunc(data){//回显

    var globalObJ = new globalConfigFunc();
    globalObJ.configSelect({
        "idName":"jurisSelect",
        "url":"/orgInfoType/keepOrgInfoType",
        "method":"post",
        "beforeFuncName":"beforeFuncName",
        "callbackName":"orgSuccessFunc",
        "selCode":"proOrgType",
        "data":configFileJson.org//角色配置项数据
    }); 

    data = JSON.parse(data);
    if(data.retCode = "0000000"){
        if(data.rspBody != null){
            $("#jurisSelect")[0].jsCtrl.setValue(null,null,data.rspBody);
        }
    }else{
        //alert(data.retDesc)
        var alertObj = new clsAlertBoxCtrl();
        alertObj.Alert(data.retDesc,"提示",true);
    };
    $("#jurisSelect").hide();
};

function beforeFuncName(dom){
    console.log(dom)
    return {
        "orgId":$("#id").text(),
        "proOrgType":$(dom).val()
    }

};
function orgSuccessFunc(data){
    console.log(data)
};
/***************************组织赋权 add结束********************/