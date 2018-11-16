
//点击确认执行的方法
function clsAlertBoxCtrl$sure() {//删除
    if(this.html.indexOf("删除提示") !=-1){
        var reqParam = {};
        if($("#detailRow").css("display") == "block"){//角色
            var data = $("#detailRow")[0].data;
            reqParam = {"opt":"delete","roleId":data.roleId}
            getAjaxResult("/roleInfo/DeleteRoleInfo", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
        }else if($("#detailRow1").css("display") == "block"){//角色组=分类
            var data = $("#detailRow1")[0].data;
           
            reqParam = {"opt":"delete","roleGroupId":data.roleGroupId}
            getAjaxResult("/roleGroup/DeleteRoleGroup", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
        };
    }
}




function clsStandardTableCtrl$progress(jsonItem, cloneRow) {
}







/************************删除角色/分类开始*****************************/
// function clsMessageBoxCtrl$after() {

    
//     //GetId()//删除时候存储父级id;
    
//     //删除的时候默认父级id选中
//     //initTree();
// }   
/************************删除角色/分类结束*****************************/

function beforeFuncName(dom){
    console.log(dom)
    return {
        "roleId":$("#detailRow")[0].data.roleId,
        "proRoleType":$(dom).val()
    }

};

function roleSuccessFunc(data){
    console.log(data)
};

(function($, global, doc){
	'use strict';

    var globalRuleOrRulesId = {};
    var orgId = GetQueryString("orgId");//组织id
    var orgName = decodeURI(GetQueryString("orgName"));//组织名称====中文转义
	var roleManage = function(options){//构造器
		options = options || {};
        this.initializeElements();//初始化属性
		this.eventsMap = {//时间集合
			//'click .btnOne': 'closeWhichWin',
		};
		this.init();
	}

	roleManage.Eles = {//静态属性，保存选择器
		// "comSelect":".comSelect",
	}

	roleManage.utils = {//工具类
        initOrg: function(data){
            data = JSON.parse(data).rspBody.children;
            // console.log(data)
            // if(data.length == 0){
            //     orgId = $.cookie("orgId");
            // }else{
            //    orgId = data[0].id;
            // }
            
            roleManage.prototype.initTree();
            $("#chooseZzBtn").click(function(){
                if(GetQueryString("orgId"))orgId = GetQueryString("orgId");
                $("#chooseZz").show();
                var a = new treeCheck();
                a.loopLoad({
                    "data":data, 
                    "parentDom":$("#looptree2"),
                    "parentId":"looptree2",
                    "showName":["orgName"],
                    "id":orgId,
                    "className":"domTreeActive"
                });
                $("#looptree2").treeview();
                openWin(400, 380, "chooseZz", true);
                

                
            })

            $("#looptree2").on("click",".cloneTreeA",function(){

                $("#looptree2 a").removeClass("domTreeActive");
                $(this).addClass("domTreeActive");

                orgId = $(this).parent()[0].data.id;
                orgName = $(this).parent()[0].data.orgName;

            });
        },
        initTreeList: function(data,id,isNeedCheck){//初始化加载权限tree
            //data 请求的数据, id 最外层id, idneedcheck是否有checkbox
            data = JSON.parse(data).rspBody.resultData;
            if(!isNeedCheck){

                if(data.length == 0){//显示暂无数据
                    $("#looptree").empty();
                    //$(".resource").show();
                    //$(".resourceAd").hide();
                    $("#detailRow")[0].data = null;
                    $("#detailRow1")[0].data = null;

                }else{//显示domtree
                    //$(".resource").hide();
                    //$(".resourceAd").show();
                    var a = new treeCheck();
                    a.loopLoad({
                        "data":data, 
                        "parentDom":$("#"+id), 
                        "isNeedCheck":isNeedCheck, 
                        "parentId":id,
                        "showName":["roleTitle","roleGroupTitle"]

                    });



                    /*************/

                    $("#looptree .cloneTreeA").click(function(){

                        var parentData = $(this).parent("li")[0].data;

                        

                        

                        /******************角色赋权开始*******************/
                        // getAjaxResult("/acctRolePurchase/selectAcctRolePurchaseType", "post", {
                        //     "roleId":parentData.roleId,
                        // }, "roleManage.utils.successEchoFunc(data)");

                        /*******************角色赋权结束*******************/

                        $(".resourceAd-con-left a").removeClass("domTreeActive");
                        $(this).addClass("domTreeActive");
                        $("#btnGather").children().hide();//按钮集合先隐藏

                        $("#detailRow").hide();//右侧信息详情显示
                        $("#detailRow1").hide();//右侧信息详情显示
                        if(parentData.orRole == "角色组"){
                            $("#detailRow1").show();//右侧信息详情显示
                        }else{
                            $("#detailRow").show();//右侧信息详情显示
                        }
                        if(parentData.orRole){//角色。分类
                            if(parentData.orRole == "角色"){//角色
                                //是否显示赋值角色
                                if($(this).parent()[0].data.type == 1){//引用
                                    $("#copyRoleLi").show();
                                    $("#editRuleOrRules").hide();
                                    $("#deleteRuleOrRules").hide();
                                }else{//创建
                                    $("#copyRoleLi").hide();
                                    $("#editRuleOrRules").show();
                                    $("#deleteRuleOrRules").show();
                                }
                            }else{//分类
                                $("#createNewRule").show();//新建角色按钮
                                $("#createNewRules").show();//新建分类按钮
                                $("#editRuleOrRules").show();
                                $("#deleteRuleOrRules").show();
                            }
                            if(parentData.orRole == "角色组"){
                                $("#detailRow1")[0].data = parentData;
                            }else{
                                $("#detailRow")[0].data = parentData;
                            }
                        }
                        if(parentData.orRole == "角色组"){
                            //setValue4Desc($(this).parent("li")[0].data, $("#detailRow1")[0])
                            roleManage.utils.setValueGlobal($(this).parent("li")[0].data, $("#detailRow1")[0])
                        }else{
                           // setValue4Desc($(this).parent("li")[0].data, $("#detailRow")[0])
                           roleManage.utils.setValueGlobal($(this).parent("li")[0].data, $("#detailRow")[0])
                        }
                     })
                }
            }else{//角色权限

                    var aa = new treeCheck();
                    aa.loopLoad({"data":data, "parentDom":$("#"+id), "isNeedCheck":isNeedCheck, "parentId":id,"showName":["functionTitle"]});
                    aa.unionChecked("input[type=checkbox]");
                   
            }
            $("#" + id + " #navigation").treeview();
        },
        successEchoFunc: function(data){//回显

            var globalObJ = new globalConfigFunc();
            globalObJ.configSelect({
                "idName":"roleSelect",
                "url":"/acctRolePurchase/keepAcctRolePurchase",
                "method":"post",
                "beforeFuncName":"beforeFuncName",
                "callbackName":"roleSuccessFunc",
                "selCode":"proRoleType",
                "data":configFileJson.role//角色配置项数据
            }); 

            data = JSON.parse(data);
            if(data.retCode = "0000000"){
                if(data.rspBody != null){
                    $("#roleSelect")[0].jsCtrl.setValue(null,null,data.rspBody);
                }
            }else{
                //alert(data.retDesc)
                var alertObj = new clsAlertBoxCtrl();
                alertObj.Alert(data.retDesc,"提示",true);
            };
            $("#roleSelect").hide();
        },
        initFlVal: function(dom,data){//$("#resourchSe #roleGroupId")[0]
            
            if(data){
                // dom.setAttribute("initValue",data.roleGroupId) 
                // document.body.jsCtrl.ctrl = dom;
                // document.body.jsCtrl.init();

                dom.innerHTML = data.roleGroupTitle;
            }else{
                dom.innerHTML = "/";
            }
        },
        setValueGlobal: function(jsonItem,dom){
            for(var key in jsonItem){
                var ctrl = $(dom).find("#"+key)[0];
                if(ctrl){
                    switch(ctrl.tagName.toLowerCase()){
                        case "input":
                            if (ctrl.type == "checkbox") {
                                if(jsonItem[key] == 1){
                                    $(ctrl).prop("checked",true)
                                }else{
                                    $(ctrl).prop("checked",false)
                                }
                            }else{
                                $(ctrl).val(jsonItem[key])
                            };
                            break;
                        default:
                            if(jsonItem[key] == "" || jsonItem[key] == null){
                                jsonItem[key] = "-"
                            }
                            if((key == "createdTime" || key == "updatedTime") && jsonItem[key] != "-" ){
                                jsonItem[key] = timestampToStr(jsonItem[key])
                            }
                            ctrl.innerHTML = jsonItem[key];

                    }
                }
            }
        },
        deleteWarn: function(data){
            data = JSON.parse(data);
            var a = new clsAlertBoxCtrl();
            a.Alert(data.rspBody,"删除提示",true);
            if(data.rspBody == "是否删除"){
                $("#alertBoxWin .btnOne").show();
            }else{
                $("#alertBoxWin .btnOne").hide();
            }
        },
        delOrSavePermission: function (data){
            data = JSON.parse(data)
            if(data.retCode != "0000000"){
                alert(data.retDesc);
                return;
            }
            if(data.rspBody.opt == "insert" || data.rspBody.opt == "update"){//新建//编辑

                if(data.rspBody.orRole == "角色"){
                    globalRuleOrRulesId.id = data.rspBody.roleId;
                    globalRuleOrRulesId.orRole = "角色";
                }else if(data.rspBody.orRole == "角色组"){
                    globalRuleOrRulesId.id = data.rspBody.roleGroupId;
                    globalRuleOrRulesId.orRole = "角色组";
                }

            }else if(data.rspBody.opt == "delete"){//删除

                globalRuleOrRulesId.id = data.rspBody.roleGroupId;
                if(data.rspBody.roleGroupId == null ){
                    globalRuleOrRulesId.orRole = "根目录";
                }else{
                    globalRuleOrRulesId.orRole = "角色组";
                }

            }
            if(data.retCode ==  "0000000"){
                roleManage.prototype.initTree();//操作成功之后初始化tree树

                var oLi = $("#looptree #navigation li");
                var flag = false;
                for(var i=0;i<oLi.length;i++){//模拟点击

                    if(globalRuleOrRulesId.orRole == "角色"){
                        if(oLi.eq(i)[0].data.roleId == globalRuleOrRulesId.id){
                            flag = true;
                            oLi.eq(i).children(".cloneTreeA").click();
                        };
                    }else if(globalRuleOrRulesId.orRole == "角色组"){
                        if(oLi.eq(i)[0].data.roleGroupId == globalRuleOrRulesId.id){
                            flag = true;
                            oLi.eq(i).children(".cloneTreeA").click();
                        };
                    }else if(globalRuleOrRulesId.orRole == "根目录"){

                    }

                }
                if(!flag){
                    $("#root").click();
                }
            };
            this.setStatus("detailRow")
            this.setStatus("detailRow1")
            closePopupWin();
            var aa = new clsAlertBoxCtrl();
            aa.Alert(data.retDesc,"操作提示",false);
        },
        setStatus: function (dom){
            if($("#"+dom)[0].data){
                if($("#" + dom + " #status").prop("checked")){

                    $("#"+dom)[0].data.status = 1;
                }else{
                    $("#"+dom)[0].data.status = 0;
                }
            }
        },
        checkHasSys:function(){

            if($("#sysList option:selected").val() == ""){
                alert("请先给该组织引用系统！")
                return true;
            }
        }
	}


	roleManage.prototype = {
		constructor:roleManage,
		init:function(){
            if(orgId){
                getAjaxResult("/orgInfo/getChildTreeOrgInfo","POST",{"parentId":orgId },"roleManage.utils.initOrg(data)")
            }else{
                orgId = $.cookie("orgId")
                if(orgId .length == 11)$("#chooseZzBtn").hide();
                getAjaxResult("/orgInfo/getChildTreeOrgInfo","POST",{"parentId":orgId },"roleManage.utils.initOrg(data)")
            }
            $("#sysList").attr({"reqParam":JSON.stringify({"orgId":orgId})});
            document.body.jsCtrl.ctrl = $("#sysList")[0];
            document.body.jsCtrl.init();

            $("#czSureBtn").click(function(e){//选择组织确认按钮

                $("#sysList").attr({"reqParam":JSON.stringify({"orgId":$("#looptree2 .domTreeActive").parents("li")[0].data.id})});
                document.body.jsCtrl.ctrl = $("#sysList")[0];
                document.body.jsCtrl.init();
                $("#detailRow").hide();
                $("#detailRow1").hide();

                if(GetQueryString("orgId")){
                    window.location.href = "./roleManage.html?orgId="+$("#looptree2 .domTreeActive").parents("li")[0].data.id;
                }else{

                    //初始化加载domtree
                    roleManage.prototype.initTree(e);
                }

                closePopupWin();
            });
            $("#czCancelBtn").click(function(){//取消
                closePopupWin();
            });

            /***************************选择系统开始****************************/

            $("#sysList").change(function(){
                roleManage.prototype.initTree();
                $("#root").click();
            });
            /***************************选择系统结束****************************/




            /***************************选择组织结束*************************/
            //root
            $("#root").click(function(){
                $(".resourceAd-con-left a").removeClass("domTreeActive");
                $(this).addClass("domTreeActive");

                $("#detailRow").hide();
                $("#detailRow1").hide();

                $("#createNewRule").show();//新建角色按钮
                $("#createNewRules").show();//新建分类按钮

                $("#deleteRuleOrRules").hide();//删除按钮
                $("#editRuleOrRules").hide();//编辑按钮

                $("#detailRow")[0].data = null;//清空角色详情dom绑定的数据
                $("#detailRow1")[0].data = null;//清空分类详情dom绑定的数据
            });
            $("#root").click();

            /************************新建角色开始***************************/
            $("#createNewRule").click(function(){
                if(roleManage.utils.checkHasSys())return;
                $("#creatRule").show();
                $("#creatRuleEdit").hide();

                roleManage.utils.initFlVal($("#resourchSe #roleGroupTitle")[0],$("#detailRow1")[0].data);//回显选择分类
                

                openWin(400, 300, "resourchSe", true);
                $("#resourchSe h2").html("新建角色");
                //setValue4Desc($("#detailRow")[0].data, $("#resourchSe")[0]);
                roleManage.utils.setValueGlobal($("#detailRow")[0].data, $("#resourchSe")[0])
                $("#resourchSe #roleTitle").val("");

                //复现初始化组织信息
                //showOrganization($("#detailRow")[0].data);
            });
            $("#creatRule").click(function(){
                initValidate($("#resourchSe")[0]);
                var obj = new clsValidateCtrl(); 
                //var data = $("#detailRow")[0].data; 
                if(obj.validateAll()){
                    if($("#resourchSe #status").prop("checked")){
                        var status = 1;
                    }else{
                        var status = 0;
                    }

                    if($("#detailRow1")[0].data){
                        var roleGroupId = $("#detailRow1")[0].data.roleGroupId;
                    }else{
                        var roleGroupId = "";
                    }

                    var reqParam = {
                        "opt":"insert",
                        "roleTitle":$("#resourchSe #roleTitle").val(),
                        "roleGroupId":roleGroupId,
                        "orgId":orgId ,
                        "status":status,
                        "sysId":$("#sysList").find("option:selected").val()
                    };
                    getAjaxResult("/roleInfo/InsertRoleInfo", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
                }
            })
            $("#cancelRule").click(function(){
                closePopupWin();
            })
            //暂无数据时新建第一条角色
            $("#creatRule1").click(function(){
                $("#creatRule").show();
                $("#creatRuleEdit").hide();
                openWin(400, 300, "resourchSe", true);
                $("#resourchSe h2").html("新建角色");
                //setValue4Desc($("#detailRow")[0].data, $("#resourchSe")[0]);
                roleManage.utils.setValueGlobal($("#detailRow")[0].data, $("#resourchSe")[0])
            });
            /************************新建角色结束***************************/
            /***********************编辑角色,角色组开始****************************/
            $("#editRuleOrRules").click(function(){//编辑当前权限

                if($("#detailRow").css("display") == "block"){//角色

                    $("#creatRule").hide();
                    $("#creatRuleEdit").show();

                    openWin(400, 300, "resourchSe", true);
                    $("#resourchSe h2").html("编辑角色");
                    roleManage.utils.setValueGlobal($("#detailRow")[0].data, $("#resourchSe")[0])
                    roleManage.utils.initFlVal($("#resourchSe #roleGroupTitle")[0],$("#detailRow")[0].data);

                    //复现初始化组织信息
                    //showOrganization($("#detailRow")[0].data);


                }else if($("#detailRow1").css("display") == "block"){//角色组

                    $("#creatRules").hide();
                    $("#creatRulesEdit").show();
                    openWin(400, 200, "resourchFl", true);
                    $("#resourchFl h2").html("编辑角色组");
                    //setValue4Desc($("#detailRow1")[0].data, $("#resourchFl")[0]);
                    roleManage.utils.setValueGlobal($("#detailRow1")[0].data, $("#resourchFl")[0])

                    //复现初始化组织信息
                    //showOrganization($("#detailRow1")[0].data);
                }
            });
            
            $("#cancelRuleOrRules").click(function(){//取消角色修改
                closePopupWin()
            })
            $("#creatRuleEdit").click(function(){//保存编辑角色
                var data = $("#detailRow")[0].data;
                var reqParam = {};

                if($("#resourchSe #status").prop("checked")){
                    var status = 1;
                }else{
                    var status = 0;
                }
                if(data){
                    reqParam = {"opt":"update","roleGroupId":$("#detailRow")[0].data.roleGroupId,"orgId":orgId ,"roleId":data.roleId,"roleTitle":$("#resourchSe #roleTitle").val(),"status":status}
                };

                initValidate($("#resourchSe1")[0]);
                var obj = new clsValidateCtrl();  
                if(obj.validateAll()){
                    getAjaxResult("/roleInfo/keepRoleInfo", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
                }
            })


            $("#creatRulesEdit").click(function(){//保存编辑角色组
                initValidate($("#resourchFl")[0]);
                var obj = new clsValidateCtrl(); 
                //var data = $("#detailRow")[0].data; 
                if(obj.validateAll()){
                    if($("#resourchFl #status").prop("checked")){
                        var status = 1;
                    }else{
                        var status = 0;
                    }
                    var reqParam = {"opt":"update","roleGroupTitle":$("#resourchFl #roleGroupTitle").val(),"orgId":orgId ,"roleGroupId":$("#detailRow1")[0].data.roleGroupId,"status":status};
                    getAjaxResult("/roleGroup/keepRoleGroup", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
                }
            })
            /***********************编辑角色,角色组结束****************************/


            /************************新建分类开始***************************/
            $("#createNewRules").click(function(){
                if(roleManage.utils.checkHasSys())return;
                $("#creatRules").show();
                $("#creatRulesEdit").hide();
                openWin(400, 200, "resourchFl", true);
                $("#resourchFl h2").html("新建分类");
                $("#resourchSe #roleGroupTitle").val("");
                //setValue4Desc($("#detailRow")[0].data, $("#resourchFl")[0]);

                //复现初始化组织信息
                //showOrganization($("#detailRow1")[0].data);
            });
            $("#creatRules").click(function(){
                initValidate($("#resourchFl")[0]);
                var obj = new clsValidateCtrl(); 
                //var data = $("#detailRow")[0].data;
                if(obj.validateAll()){
                    if($("#resourchFl #status").prop("checked")){
                        var status = 1;
                    }else{
                        var status = 0;
                    }
                    if($("#detailRow1")[0].data){
                        var parentApplicationId = $("#detailRow1")[0].data.roleGroupId;
                    }else{
                        var parentApplicationId = "";
                    }
                    var reqParam = {
                        "opt":"insert",
                        "roleGroupTitle":$("#resourchFl #roleGroupTitle").val(),
                        "orgId":orgId ,
                        "status":status,
                        "parentApplicationId":parentApplicationId,
                        "sysId":$("#sysList").find("option:selected").val()
                    };
                    getAjaxResult("/roleGroup/InsertRoleGroup", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
                }
            })
            $("#cancelRules").click(function(){
                closePopupWin();
            })

            //暂无数据时新建第一条分类
            $("#creatRules1").click(function(){
                $("#creatRules").show();
                $("#creatRulesEdit").hide();
                openWin(400, 200, "resourchFl", true);
                $("#resourchFl h2").html("新建分类");
                //setValue4Desc($("#detailRow1")[0].data, $("#resourchFl")[0]);
                roleManage.utils.setValueGlobal($("#detailRow1")[0].data, $("#resourchFl")[0])
            });
            /************************新建分类结束***************************/
            /*************************给角色分配权限开始***************************/
            $("#checkRole").click(function(){

                // var reaParam = {
                //     "orgId":orgId ,
                //     "roleId":$("#detailRow")[0].data.roleId,
                //     "type":$("#detailRow")[0].data.type
                // };
                openWin(400, 300, "resourchSeSet", true);


                roleManage.prototype.initTree1();
            })
            //保存修改
            $("#saveRoleResource").click(function(){
                var reqParam = {"functionIds":"","roleId":$("#detailRow")[0].data.roleId};
                for(var i=0;i<$("#looptree1 li").length; i++){
                    if($("#looptree1 li").eq(i).find("input").prop("checked") == 1){
                        if(reqParam.functionIds == ""){
                            reqParam.functionIds = $("#looptree1 li").eq(i)[0].data.functionId;
                        }else{
                            reqParam.functionIds += "," + $("#looptree1 li").eq(i)[0].data.functionId;
                        }
                    }
                }
                getAjaxResult("/acctOperPrivRela/addAcctOperPrivRela", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
            });
            //取消修改
            $("#cancelRoleResource").click(function(){
                closePopupWin();
            });
                
            /*************************给角色分配权限结束***************************/
            /**************************启用角色、角色组开始*****************************/
            $("#detailRow #status").click(function(){//角色
                if($("#detailRow #status").prop("checked")){
                    var status = 1;
                }else{
                    var status = 0;
                }
                var reqParam = {"opt":"update","roleId":$("#detailRow")[0].data.roleId,"status":status,"IsStatus":1}
                getAjaxResult("/roleInfo/keepRoleInfo", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');

            })
            $("#detailRow1 #status").click(function(){//角色组
                if($("#detailRow1 #status").prop("checked")){
                    var status = 1;
                }else{
                    var status = 0;
                }
                var reqParam = {"opt":"update","roleGroupId":$("#detailRow1")[0].data.roleGroupId,"status":status,"IsStatus":1}
                getAjaxResult("/roleGroup/keepRoleGroup", "post", reqParam, 'roleManage.utils.delOrSavePermission(data)');
            })
            /**************************启用角色、角色组结束*****************************/

            $("#deleteRuleOrRules").click(function(){


                var reqParam = {};
                //删除前请请求接口返回删除内容提示
                if($("#detailRow").css("display") == "block"){//角色
                    var data = $("#detailRow")[0].data;
                    reqParam = {"opt":"delete","roleId":data.roleId}
                    getAjaxResult("/roleInfo/verificationDeleteRoelInfo", "post", reqParam, 'roleManage.utils.deleteWarn(data)');
                }else if($("#detailRow1").css("display") == "block"){//角色组=分类
                    var data = $("#detailRow1")[0].data;
                   
                    reqParam = {"opt":"delete","roleGroupId":data.roleGroupId}
                    getAjaxResult("/roleGroup/verificationDeleteRoleGroup", "post", reqParam, 'roleManage.utils.deleteWarn(data)');
                };


            })



            /***********************角色已引用的组织开始*******************************/
            $("#refernenceRole").click(function(){
                var reqParam = {};
                
                //reqParam.orgId = $("#looptree .domTreeActive").parent()[0].data.orgId;
                reqParam.roleId = $("#looptree .domTreeActive").parent()[0].data.roleId;
                reqParam.sysId = $("#sysList").find("option:selected").val();
                $("#org-table").attr({"comType":"standardTableCtrl","reqParam":JSON.stringify(reqParam)});
                document.body.jsCtrl.ctrl = $("#org-table")[0];
                document.body.jsCtrl.init();
                openWin(500, 400, "referneceBox", true);
                //$("#allChk").click();
                $("#org-table input").prop("checked",true)
            });
            $("#referneceBtn").click(function(){
                var reqParam = {
                    "opt":"delete", 
                    "orgIds":[], 
                    "roleId":$("#looptree .domTreeActive").parent()[0].data.roleId}
                $("#org-table #cloneRow").each(function(i,e){
                    if($(e).find("input").prop("checked")){
                        reqParam.orgIds.push(e.jsonData.id);
                    }
                })

                getAjaxResult("/acctRoleOrg/save", "post", reqParam, function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        //alert("操作成功");
                        closePopupWin();
                        var alertObj = new clsAlertBoxCtrl();
                        alertObj.Alert("操作成功","提示",true);
                    }
                });
            });
            $("#referneceCancelBtn").click(function(){
                closePopupWin();
            });

            /***********************角色已引用的组织结束*******************************/


            /***********************角色引用到组织开始*******************************/

            $("#refernenceRole1").click(function(){
                var reqParam = {};
                console.log(orgId)
                reqParam.orgId = $("#looptree .domTreeActive").parent()[0].data.orgId;
                reqParam.roleId = $("#looptree .domTreeActive").parent()[0].data.roleId;
                reqParam.sysId = $("#sysList").find("option:selected").val();
                $("#org-table1").attr({"comType":"standardTableCtrl","reqParam":JSON.stringify(reqParam)});
                document.body.jsCtrl.ctrl = $("#org-table1")[0];
                document.body.jsCtrl.init();
                openWin(700, 500, "referneceBox1", true);
                $("#orgList #orgCloneRow").remove();
            });

            $("#referneceBox1").on("click",".deleteOrg",function(){
                console.log(1)
                $(this).parent().remove();
                var reqParam = JSON.parse($("#org-table1").attr("reqParam"))
                reqParam.orgIds = []
                for(var i=0;i< $("#orgList #orgCloneRow").length;i++){
                    reqParam.orgIds.push($("#orgList #orgCloneRow").eq(i)[0].jsonData.id)
                }
                $("#org-table1").attr("reqParam",JSON.stringify(reqParam))
                //$("#org-table1").attr("reqParam",)
                document.body.jsCtrl.ctrl = $("#org-table1")[0];
                document.body.jsCtrl.init();

            })
            $("#referneceBtn1").click(function(){

                var reqParam = {"opt":"insert", "orgIds":[], "roleId":$("#looptree .domTreeActive").parent()[0].data.roleId}
                $.each($("#orgList #orgCloneRow"),function(i,e){
                    reqParam.orgIds.push(e.jsonData.id)
                })

                getAjaxResult("/acctRoleOrg/save", "post", reqParam, function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        //alert("操作成功");
                        closePopupWin();
                        var alertObj = new clsAlertBoxCtrl();
                        alertObj.Alert("操作成功","提示",true);
                    }
                });
            })
            $("#referneceCancelBtn1").click(function(){
                closePopupWin();
            })

            /***********************角色引用到组织结束*******************************/

            /**************************复制角色开始***********************************/
            $("#copyRole").click(function(){
                openWin(400, 380, "copyRoleBox", true);
                $("#copyRoleBox h2").text("复制角色");
            })
            $("#sureCopy").click(function(){
                var status = null;
                if($("#copyStatus").prop("checked")){

                    status = 1;

                }else{

                    status = 0;
                }
                
                var reqParam = {
                    "orgId":orgId,
                    "roleTitle":$("#copyRoleTitle").val(),
                    "status":status,
                    "sysId":$("#sysList").find("option:selected").val()
                }
                getAjaxResult("/roleInfo/saveCopyRole", "post", reqParam, function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        //alert("操作成功");
                        var alertObj = new clsAlertBoxCtrl();
                        alertObj.Alert("操作成功","提示",true);
                        closePopupWin();
                    }
                });
            })
            $("#cancelCopy").click(function(){
                closePopupWin();
            })
            /**************************复制角色结束***********************************/

            /***********************************************************/

            $("#org-table1").on("click","#addOrg",function(){
                var reqParam = {
                    "orgIds":[$(this).parents("tr")[0].jsonData.id],
                    "roleTitle":$("#looptree .domTreeActive").parent()[0].data.roleTitle
                }
                var flag = false;
                getAjaxResult("/roleInfo/verQuoteRoleTitle", "post", reqParam, function(data){
                    
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        if(data.rspBody == "1"){//重复
                            //alert("重复");
                            var alertObj = new clsAlertBoxCtrl();
                            alertObj.Alert("重复","提示",true);
                        }else if(data.rspBody == "0"){
                            flag = true;
                        }
                    }

                });
                if(flag){

                    var orgCloneRow = $("#orgList #orgTemplateRow").clone();
                    orgCloneRow[0].id = "orgCloneRow";
                    orgCloneRow[0].style.display = "";
                    orgCloneRow[0].jsonData = $(this).parents("tr")[0].jsonData
                    orgCloneRow.find("span").text(orgCloneRow[0].jsonData.orgName)
                    $("#orgList").append(orgCloneRow)
                    var reqParam = JSON.parse($("#org-table1").attr("reqParam"))
                    reqParam.orgIds = []
                    for(var i=0;i< $("#orgList #orgCloneRow").length;i++){
                        reqParam.orgIds.push($("#orgList #orgCloneRow").eq(i)[0].jsonData.id)
                    }
                    $("#org-table1").attr("reqParam",JSON.stringify(reqParam))
                    //$("#org-table1").attr("reqParam",)
                    document.body.jsCtrl.ctrl = $("#org-table1")[0];
                    document.body.jsCtrl.init();
                }


                
            })





			this.initWidgets();//初始化组件
			this.bindEvent(this.eventsMap);//绑定事件
		},
        initializeElements: function() {
        	//初始化静态属性（初始化选择器）
            var eles = roleManage.Eles;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
        },
        _scanEventsMap: function(maps, isOn){
        	//扫描事件
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            var bind = isOn ? this._delegate : this._undelegate;
            for (var keys in maps) {
                if (maps.hasOwnProperty(keys)) {
                    var matchs = keys.match(delegateEventSplitter);

                    bind(matchs[1], matchs[2], this[maps[keys]].bind(this));
                }
            }

        },
        initTree: function(e){//查询角色信息
            var e = e || event;
            var target = e.target || e.srcElement;

            if(GetQueryString("orgId"))orgId = GetQueryString("orgId");

            getAjaxResult("/roleInfo/roleInfoTree", "post", {
                "orgIdAll":orgId,
                "sysId":$("#sysList").find("option:selected").val()
            }, 'roleManage.utils.initTreeList(data,"looptree")');
        },
        initTree1: function (){//查询角色权限信息
            var data = $("#detailRow")[0].data;
            getAjaxResult("/functionManage/functionManageRoleList", "post", {
                "orgId":data.orgId,
                "roleId":data.roleId,
                "sysId":$("#sysList").find("option:selected").val(),
                "type":data.type
            }, 'roleManage.utils.initTreeList(data,"looptree1",true)');
        },
        initializeOrdinaryEvents: function(maps){
        	//执行扫描事件
        	this._scanEventsMap(maps, true);
        },
        uninitializeOrdinaryEvents: function(maps) {
            this._scanEventsMap(maps);
        },
        _delegate: function(name, selector, func) {
        	//委派/绑定事件
            doc.on(name, selector, func);
        },
        _undelegate: function(name, selector, func) {
        	//解绑事件
            doc.off(name, selector, func);
        },
        initWidgets: function(){
        	//初始化组件
        },
        bindEvent: function(maps) {
        	//绑定事件
            this.initializeOrdinaryEvents(maps);
        },
	    destroyWidgets: function(){
	        // 销毁组件
	    }

	}

	global.roleManage = roleManage;//对外暴露一个接口

    $(function(){
        new roleManage(); 
    });


})(this.jQuery, this, this.jQuery(document));
