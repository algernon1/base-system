
// function setValue4DescProcess(jsonItem, key,jsonData) {
//     if(key == "status"){
//         if(jsonItem[key]){
//              window.obj.resourchSe.find("input").prop("checked",true)
//         }else{
//             window.obj.resourchSe.find("input").prop("checked",false)
//         }
//     }
//     console.log(key)
// }

//点击确认执行的方法
function clsAlertBoxCtrl$sure() {

    if(this.html.indexOf("删除提示") !=-1){
        var data = window.obj.detailRow[0].data;
        var reqParam = {};
        if(data){
            reqParam = {"opt":"delete","functionId":data.functionId}
        };
        window.resourceManage.prototype.getSysId();
        getAjaxResult("/functionManage/DeleteFunctionManage", "post", reqParam, function(data){
            //window.resourceManage 构造函数  window.obj 实例
            window.resourceManage.prototype.delOrSavePermission(data,window.obj)
        });

    }
}
(function($, global, doc){
	'use strict';

    var globalFunctionId = "";
    var orgId = GetQueryString("orgId");//组织id
    var orgName = decodeURI(GetQueryString("orgName"));//组织名称====中文转义
	var resourceManage = function(options){//构造器
		options = options || {};
        this.initializeElements();//初始化属性
		this.eventsMap = {//时间集合
            'click #root':"clickRoot",//点击根目录
            'click #creatPermi':'clickCreatPermi',//新建权限  点击确认执行函数
            'click #cancelPermi':'clickCancelPermi',//新建权限  点击取消执行函数
            'click #addPermission':'clickAddPermission',//暂无权限，新增权限执行函数
            'click #createNewPermission':'clickCreateNewPermission',//新增下级权限
            'click #editPermission':'clickEditPermission',//编辑当前权限
            'click #cancelPermiEdit':'clickCancelPermiEdit',//取消权限修改
            'click #detailRow #status':'clickEnablePermi',//启用权限
            'click #deletePermission':'clickDeletePermission',//删除权限
            'click #looptree .cloneTreeA':'clickResource',//点击左侧资源
            'click #chooseZzBtn':'clickOrgAlert',//点击弹出组织弹窗
            'click #looptree2 .cloneTreeA':'clickOrg',//点击组织
            "change #sysList":"changeSysList"//系统下拉框onchange时调用函数

		};
		this.initialization();
	}

	resourceManage.Eles = {// 定义构造函数静态属性，挂载所有选择器的属性
		// "comSelect":".comSelect",
        "chooseZzBtn":"#chooseZzBtn",//选择组织按钮
        "chooseZz":"#chooseZz",//选择组织的弹窗（组织列表）
        "root":"#root",//根目录按钮
        "creatPermi":"#creatPermi",//新建权限按钮
        "cancelPermi":"#cancelPermi",//取消新建权限按钮
        "addPermission":"#addPermission",//暂无权限，新增权限id
        "createNewPermission":"#createNewPermission",////新增下级权限id
        "detailRow":"#detailRow",//资源详情父级id
        "deletePermission":"#deletePermission",//删除资源id
        "editPermission":"#editPermission",//编辑资源id
        "resourchSe":"#resourchSe",//新增权限弹窗id
        "cancelPermiEdit":"#cancelPermiEdit",//取消权限修改id
        "resourceAdConLeft":".resourceAd-con-left",//左侧树形资源盒子id
        "looptree":"#looptree",//资源树id
        "looptree2":"#looptree2",//组织树id
        "sysList":"#sysList"//选择组织下拉框id

	}

	var utils = {//工具类
        getDom:function(e){
            var e = e || event;
            return $(e.target || e.srcElement);
        },
        setValueGlobal: function(jsonItem,dom){
            for(var key in jsonItem){
                var ctrl = $(dom).find("#"+key)[0];
                if(ctrl){
                    switch(ctrl.tagName.toLowerCase()){
                        case "input":
                        case "textarea":
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
        }
	}


	resourceManage.prototype = {
		constructor:resourceManage,
		initialization:function(){
            
            this.initWidgets();//初始化组件
            this.bindEvent(this.eventsMap);//绑定事件


            /***************************选择/初始化 组织开始*************************/
            this.chooseOrg(this);
            /***************************选择/初始化 组织结束*************************/
           
            /************************新建权限开始*****************************/
            /************************新建权限结束*****************************/

            /***********************编辑权限开始****************************/
            /***********************编辑权限结束****************************/

            /**************************启用权限开始*****************************/
            /**************************启用权限结束*****************************/

            /**************************删除权限开始*****************************/
            /**************************删除权限结束*****************************/

            this.root.click();

		},
        initializeElements: function () {
            var eles = resourceManage.Eles;
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
        initTree: function(sysId){

            getAjaxResult("/functionManage/functionManageList", "post", {"sysId":sysId}, function(data){
                resourceManage.prototype.initTreeList(data,"looptree")
            });
        },
        initOrg: function(data,obj){
            if(JSON.parse(data).rspBody && JSON.parse(data).rspBody.length > 0 ){
                data = JSON.parse(data).rspBody;

                this.initTree(data[0].sysId);
                obj.chooseZz[0].data = data;
            }else{
                //alert("请先创建系统");
                return;
            }

            var sysId = GetQueryString("sysId");//系统id
            if(sysId){

                resourceManage.prototype.initTree(sysId);
                $(resourceManage.Eles.sysList).attr({"initValue":sysId});

                document.body.jsCtrl.ctrl = $(resourceManage.Eles.sysList)[0];
                document.body.jsCtrl.init();
            }
        },
        initTreeList: function(data,id,isNeedCheck){//初始化加载权限tree
            //data 请求的数据, id 最外层id, idneedcheck是否有checkbox
            data = JSON.parse(data).rspBody.resultData;
            if(data.length == 0){
                $("#looptree").empty();
                // $(".resource").show();
                // $(".resourceAd").hide();
                $(resourceManage.Eles.detailRow)[0].data = null;
            }else{
                // $(".resource").hide();
                // $(".resourceAd").show();
                var a = new treeCheck();


                a.loopLoad({
                    "data":data, 
                    "parentDom":$("#"+id), 
                    "isNeedCheck":isNeedCheck, 
                    "parentId":id,
                    "showName":["functionTitle"]
                });

                a.unionChecked("input[type=checkbox]");

                $("#" + id + " #navigation").treeview();

                $("#root").click();

            }
        },


        clickRoot: function(e){//点击根目录
            if(!this.sysList.find("option:selected")[0]){
                alert("请先创建系统")
                window.location.href = "./systemManage.html";
            }
            this.resourceAdConLeft.find("a").removeClass("domTreeActive");
            utils.getDom(e).addClass("domTreeActive");

            if(this.sysList.find("option:selected")[0].domNode.relaStatus == 1){//引用
                this.createNewPermission.hide();
            }else{
                this.createNewPermission.show();
            }
            this.detailRow.hide();
            this.deletePermission.hide();
            this.editPermission.hide();
            this.detailRow[0].data = null;
        },
        getSysId: function(){

                getAjaxResult("/sysInfo/selectSysInfoOrgSee","POST",{},function(data){
                    if(!window.sysId)window.sysId = JSON.parse(data).rspBody[0].sysId;
                })
        },
        clickCreatPermi: function(e){//新建权限  点击确认执行函数

            initValidate(this.resourchSe[0]);
            var obj = new clsValidateCtrl();  
            if(obj.validateAll())
            {
                this.getSysId();
                // if(this.resourchSe.find("#status").prop("checked")){
                //     var status = 1
                // }else{
                //     var status = 0;
                // }
                if(this.resourchSe.find("h2").html() == "新建权限" ){//新建
                    var reqParam = {
                        "functionTitle":this.resourchSe.find("#functionTitle").val(),
                        "opt":"insert",
                        "sysId":window.sysId,
                        "functionPath":this.resourchSe.find("#functionPath").val(),
                        "status":1
                    };
                    if(this.detailRow[0].data){
                        reqParam.parentApplicationId = this.detailRow[0].data.functionId;
                    }
                    // /functionManage/keepFunctionManage
                    getAjaxResult("/functionManage/InsertFunctionManage", "post", reqParam, function(data){
                        resourceManage.prototype.delOrSavePermission(data,this)
                    });//'resourceManage.prototype.delOrSavePermission(data)'
                }else{//编辑

                    var data = this.detailRow[0].data;
                    var reqParam = {};
                    if(data){
                        reqParam = {"functionTitle":this.resourchSe.find("#functionTitle").val(),"functionPath":this.resourchSe.find("#functionPath").val(),"opt":"update","orgId":orgId,"functionId":data.functionId,"status":1}
                    };
                    //globalFunctionId = global.obj.detailRow[0].data.functionId;
                    getAjaxResult("/functionManage/keepFunctionManage", "post", reqParam, function(data){
                        resourceManage.prototype.delOrSavePermission(data,this)
                    });//'resourceManage.prototype.delOrSavePermission(data)'
                }

            }
        },
        clickCancelPermi: function(e){//新建权限  点击取消执行函数
            closePopupWin()
        },
        clickAddPermission: function(e){//暂无权限，新增权限
            openWin(400, 300, "resourchSe", true);
            this.resourchSe.find("h2").html("新建权限");
        },
        clickCreateNewPermission: function(e){//新增下级权限
            openWin(400, 300, "resourchSe", true);
            this.resourchSe.find("h2").html("新建权限");
            this.resourchSe.find("#functionTitle").val("");
            this.resourchSe.find("#functionPath").val("");
        },
        clickEditPermission: function(e){//编辑当前权限
            openWin(400, 300, "resourchSe", true);
            this.resourchSe.find("h2").html("编辑权限");
            //setValue4Desc(global.obj.detailRow[0].data, global.obj.resourchSe[0]);
            utils.setValueGlobal(this.detailRow[0].data, this.resourchSe[0]);

            //复现初始化组织信息
            //showOrganization(global.obj.detailRow[0].data);
        },
        clickCancelPermiEdit: function(e){//取消权限修改
            closePopupWin()
        },
        clickEnablePermi: function(e){//启用权限
            if(this.detailRow.find("#status").prop("checked")){
                var status = 1;
            }else{
                var status = 0;
            }
            reqParam = {"opt":"update","functionId":global.obj.detailRow[0].data.functionId,"status":1}
            getAjaxResult("/functionManage/keepFunctionManage", "post", reqParam, function(data){
                resourceManage.prototype.delOrSavePermission(data,this)
            });//'resourceManage.prototype.delOrSavePermission(data)'
        },
        clickDeletePermission: function(e){//删除权限
            var data = this.detailRow[0].data;
            var reqParam = {};
            if(data){
                reqParam = {"opt":"delete","functionId":data.functionId}
            };
            //globalFunctionId = global.obj.detailRow[0].data.parentApplicationId;//删除时候存储父级id;
            getAjaxResult("/functionManage/verificationDeleteFunction", "post", reqParam, function(data){
                resourceManage.prototype.deleteWarn(data)
            });//'resourceManage.prototype.delOrSavePermission(data)'
        },




        clickResource: function(e){//点击左侧资源执行的函数
            this.resourceAdConLeft.find("a").removeClass("domTreeActive");
            utils.getDom(e).addClass("domTreeActive");
            if(this.sysList.find("option:selected")[0].domNode.relaStatus == 1){//引用关系
                this.createNewPermission.hide();
                this.deletePermission.hide();
                this.editPermission.hide();
            }else{
                this.createNewPermission.show();
                this.deletePermission.show();
                this.editPermission.show();
            }
            this.detailRow.show();
            this.detailRow[0].data = utils.getDom(e).parent("li")[0].data;
            utils.setValueGlobal(utils.getDom(e).parent("li")[0].data, this.detailRow[0]);
        },
        clickOrgAlert: function(e){//点击弹出组织弹窗
            this.chooseZz.show();
            var a = new treeCheck();
            a.loopLoad({
                "data":this.chooseZz[0].data, 
                "parentDom":this.looptree2,
                "parentId":"looptree2",
                "showName":["sysTitle"]
            });
            this.looptree2.treeview();
            openWin(400, 380, "chooseZz", true);
        },
        changeSysList: function(e){
            window.sysId = utils.getDom(e).find("option:selected").val();
            resourceManage.prototype.initTree(utils.getDom(e).find("option:selected").val());
        },
        sysList: function(e){
        },
        clickOrg: function(e){//点击组织
            this.looptree2.find("a").removeClass("domTreeActive");
            utils.getDom(e).addClass("domTreeActive");

            orgId = utils.getDom(e).parent()[0].data.id;
            orgName = utils.getDom(e).parent()[0].data.orgName;
        },

        chooseOrg: function(obj){//选择/初始化 系统开始
            
            getAjaxResult("/sysInfo/selectSysInfoOrgSee","POST",{},function(data){
                resourceManage.prototype.initOrg(data,obj)
            })

            $("#czSureBtn").click(function(){//选择组织确认按钮
                window.sysId = window.obj.looptree2.find(".domTreeActive").parent()[0].data.sysId;
                //初始化加载domtree
                resourceManage.prototype.initTree(window.sysId);
                closePopupWin();
            });
            $("#czCancelBtn").click(function(){//取消
                closePopupWin();
            });
        },

        deleteWarn: function(data){
            var a = new clsAlertBoxCtrl();
            a.Alert(JSON.parse(data).rspBody,"删除提示",true);
        },
        delOrSavePermission: function (data){
            data = JSON.parse(data)
            if(data.retCode != "0000000"){
                //alert(data.retDesc);
                var alertObj = new clsAlertBoxCtrl();
                alertObj.Alert(data.retDesc,"提示",true);
                return;
            }
            if(data.rspBody.opt == "insert" || data.rspBody.opt == "update"){//新建//编辑

                globalFunctionId = data.rspBody.functionId;

            }else if(data.rspBody.opt == "delete"){//删除

                globalFunctionId = data.rspBody.parentApplicationId;

            }

            if(data.retCode ==  "0000000")
            {
                resourceManage.prototype.initTree(window.sysId);//操作成功之后初始化tree树

                var oLi = global.obj.looptree.find("#navigation li");
                var flag = false;
                for(var i=0;i<oLi.length;i++){//模拟点击

                    if(oLi.eq(i)[0].data.functionId == globalFunctionId){
                        flag = true;
                        oLi.eq(i).children(".cloneTreeA").click();
                    };

                }
                if(!flag){
                    global.obj.root.click();
                }

            }
            
            this.setStatus("detailRow")
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

	global.resourceManage = resourceManage;/// 将构造函数挂在window上，那么在外部也能访问闭包内的属性，相当于对外暴露了一个接口

    $(function(){
        var obj = new resourceManage(); 
        //将实例挂在window上
        global.obj = obj;

        //模拟根目录点击 =》 初始化展示根目录资源详情
        global.obj.root.click()
    });


})(this.jQuery, this, this.jQuery(document));
