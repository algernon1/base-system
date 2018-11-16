


//点击确认执行的方法
function clsAlertBoxCtrl$sure() {

    if(this.html.indexOf("删除提示") !=-1){
        var data = window.obj.detailRow[0].data;
        var reqParam = {};
        if(data){
            reqParam = {"opt":"delete","sysId":data.sysId}
        };
        //globalFunctionId = global.obj.detailRow[0].data.parentApplicationId;//删除时候存储父级id;
        getAjaxResult("/sysInfo/delete", "post", reqParam, function(data){
            //window.resourceManage 构造函数  window.obj 实例
            window.systemManage.prototype.delOrSavePermission(data,window.obj)
        });//'resourceManage.prototype.delOrSavePermission(data)'
        //删除的时候默认父级id选中
        //initTree();
    }else{

    }
}


(function($, global, doc){
	'use strict';

    var globalFunctionId = "";
    var orgId = GetQueryString("orgId");//组织id
    var orgName = decodeURI(GetQueryString("orgName"));//组织名称====中文转义
	var systemManage = function(options){//构造器
		options = options || {};
        this.initializeElements();//初始化属性
		this.eventsMap = {//时间集合
            "click #addSystem":"clickAdd",//暂无系统，新增系统id
            'click #root':"clickRoot",//点击根目录
            'click #sysLooptree .cloneTreeA':'clickSystem',//点击左侧系统
            'click #edit':'clickEdit',//编辑当前系统
            'click #add':'clickAdd',//新建系统
            'click #delete':'clickDelete',//删除系统id（弹窗）
            'click #creatSystem':'clickCreatSystem',//新建系统  点击确认执行函数
            'click #cancelSystem':'clickCancelSystem',//新建系统  点击取消执行函数
            'click #checkResource':'clickCheckResource'//新建系统  点击取消执行函数
		};
		this.initialization();
	}

	systemManage.Eles = {// 定义构造函数静态属性，挂载所有选择器的属性
        "root":"#root",//根目录id
        "resourceAdConLeft":".resourceAd-con-left",//左侧树形资源盒子id
        "add":"#add",//新增
        "edit":"#edit",//编辑
        "delete":"#delete",//删除
        "detailRow":"#detailRow",//系统详情父级id
        "resourchSe":"#resourchSe",//新增/编辑 系统弹窗id
        "creatSystem":"#creatSystem",//新建权限按钮
        "cancelSystem":"#cancelSystem",//取消新建权限按钮
        "sysTitle":"#sysTitle",//系统名称
        "sysDesc":"#sysDesc",//系统描述
        "sysCode":"#sysCode",//系统code
        "stauts":"#status",//是否启用系统
        'sysLooptree':'#sysLooptree',//左侧系统
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
        },
        getStatusNum: function(obj){
            var status = null;
            if(obj.prop("checked")){
                status = 1
            }else{
                status = 0;
            }
            return status;
        }
	}


	systemManage.prototype = {
		constructor:systemManage,
        initSystem: function(){

            getAjaxResult("/sysInfo/selectSysInfoOrgSee","POST",{},function(data){

                systemManage.prototype.initTreeList(data,"sysLooptree",false)
            })
        },
        initTreeList: function(data,id,isNeedCheck,obj){//初始化加载权限tree
            //data 请求的数据, id 最外层id, idneedcheck是否有checkbox
            data = JSON.parse(data).rspBody;
            if(data.length == 0){
                $(".resource").show();
                $(".resourceAd").hide();
                $("#detailRow")[0].data = null;
            }else{
                $(".resource").hide();
                $(".resourceAd").show();
                var a = new treeCheck();


                a.loopLoad({
                    "data":data, 
                    "parentDom":$("#"+id), 
                    "isNeedCheck":isNeedCheck, 
                    "parentId":id,
                    "showName":["sysTitle"]
                });

                a.unionChecked("input[type=checkbox]");

                $("#" + id + " #navigation").treeview();
            }
        },
        // clickAddSystem: function(e){
        //     this.resourchSe.find("h2").html("新建权限");
        //     this.resourchSe.find("#sysTitle").val("");
        //     this.resourchSe.find("#sysDesc").val("");
        //     openWin(400, 300, "resourchSe", true);
        //     this.resourchSe.find("h2").html("新建系统");
        // },
        clickRoot: function(e){//点击根目录

            this.resourceAdConLeft.find("a").removeClass("domTreeActive");
            utils.getDom(e).addClass("domTreeActive");
            this.add.show();
            this.detailRow.hide();
            this.delete.hide();
            this.edit.hide();
            this.detailRow[0].data = null;

        },
        clickSystem: function(e){//点击左侧资源执行的函数
            this.resourceAdConLeft.find("a").removeClass("domTreeActive");
            utils.getDom(e).addClass("domTreeActive");
            this.add.hide();
            this.delete.show();
            this.edit.show();
            this.detailRow.show();
            this.detailRow[0].data = utils.getDom(e).parent("li")[0].data;
            utils.setValueGlobal(utils.getDom(e).parent("li")[0].data, this.detailRow[0]);
        },
        clickEdit: function(e){//编辑当前权限
            openWin(400, 300, "resourchSe", true);
            this.resourchSe.find("h2").html("编辑系统");
            //setValue4Desc(global.obj.detailRow[0].data, global.obj.resourchSe[0]);
            utils.setValueGlobal(this.detailRow[0].data, this.resourchSe[0]);

            //复现初始化组织信息
            //showOrganization(global.obj.detailRow[0].data);
        },
        clickAdd: function(){//新增系统
            openWin(400, 300, "resourchSe", true);
            this.resourchSe.find("h2").html("新建系统");
            this.resourchSe.find("#sysTitle").val("");
            this.resourchSe.find("#sysDesc").val("");
        },
        clickCreatSystem: function(e){//新建系统  点击确认执行函数

            initValidate(this.resourchSe[0]);
            var obj = new clsValidateCtrl();  
            if(obj.validateAll())
            {
                var reqParam = {};

                window.isRepeat = false;//系统名是否重复

                if(this.detailRow[0].data){
                    reqParam = {
                        "sysTitle":this.resourchSe.find("#sysTitle").val(),
                        "sysId":this.detailRow[0].data.sysId
                    }

                }else{
                    reqParam = {
                        "sysTitle":this.resourchSe.find("#sysTitle").val()
                    }
                }
                getAjaxResult("/sysInfo/verInsertSysInfo", "post", reqParam, function(data){

                    systemManage.prototype.isRepeat(data);
                });
                if(window.isRepeat)return;//名称重复，不往下执行
                if(this.resourchSe.find("h2").html() == "新建系统" ){//新建

                    reqParam = {
                        "opt":"insert",
                        "status":utils.getStatusNum(this.resourchSe.find("#status")),
                        "sysDesc":this.resourchSe.find("#sysDesc").val(),
                        "sysTitle":this.resourchSe.find("#sysTitle").val()

                    };
                    if(this.detailRow[0].data){
                        reqParam.parentApplicationId = this.detailRow[0].data.functionId;
                    }


                    getAjaxResult("/sysInfo/save", "post", reqParam, function(data){
                        systemManage.prototype.delOrSavePermission(data,this)
                    });
                }else{//编辑

                    var data = this.detailRow[0].data;
                    if(data){
                        reqParam = {
                            "opt":"update",
                            "status":utils.getStatusNum(this.resourchSe.find("#status")),
                            "sysDesc":this.resourchSe.find("#sysDesc").val(),
                            "sysTitle":this.resourchSe.find("#sysTitle").val(),
                            "sysId":this.detailRow[0].data.sysId
                        }
                    };
                    //globalFunctionId = global.obj.detailRow[0].data.functionId;
                    getAjaxResult("/sysInfo/update", "post", reqParam, function(data){
                        systemManage.prototype.delOrSavePermission(data)
                    });
                }

            }
        },
        clickCancelSystem: function(){
             closePopupWin()
        },
        clickDelete: function(e){
          
            var data = this.detailRow[0].data;
            var reqParam = {};
            if(data){
                reqParam = {"opt":"delete","sysId":data.sysId}
            };
            //globalFunctionId = global.obj.detailRow[0].data.parentApplicationId;//删除时候存储父级id;
            getAjaxResult("/sysInfo/verSysInfo", "post", reqParam, function(data){
                systemManage.prototype.deleteWarn(data)
            });
        },
        clickCheckResource: function(e){
            var data = utils.getDom(e).parents("#detailRow")[0].data;
            window.location.href = "./resourceManage.html?sysId="+data.sysId
        },
        deleteWarn: function(data){
            var a = new clsAlertBoxCtrl();
            a.Alert(JSON.parse(data).rspBody,"删除提示",true);
        },
        isRepeat: function(data){
            if(JSON.parse(data).rspBody == 1){//名称重复
                window.isRepeat = true;
                var repeatTip = new clsAlertBoxCtrl();
                repeatTip.Alert("名称重复，请修改名称","提示",true);
                global.obj.resourchSe.hide();
            }
        },

        delOrSavePermission: function (data){
            data = JSON.parse(data)
            if(data.retCode != "0000000"){
                alert(data.retDesc);
                return;
            }
            if(data.rspBody.opt == "insert" || data.rspBody.opt == "update"){//新建//编辑

                globalFunctionId = data.rspBody.sysId;

            }else if(data.rspBody.opt == "delete"){//删除

                globalFunctionId = null;//根目录

            }

            if(data.retCode ==  "0000000")
            {
                systemManage.prototype.initSystem();//操作成功之后初始化tree树

                var oLi = global.obj.sysLooptree.find("#navigation li");
                var flag = false;
                for(var i=0;i<oLi.length;i++){//模拟点击

                    if(oLi.eq(i)[0].data.sysId == globalFunctionId){
                        flag = true;
                        oLi.eq(i).children(".cloneTreeA").click();
                    };

                }
                if(!flag){
                    global.obj.root.click();
                }

            }
            
            //this.setStatus("detailRow")
            closePopupWin();
            var aa = new clsAlertBoxCtrl();
            aa.Alert(data.retDesc,"操作提示",false);
        },

        
        initialization:function(){
            
            this.initWidgets();//初始化组件
            this.bindEvent(this.eventsMap);//绑定事件

            //初始化系统列表
            this.initSystem(this);

            //模拟根目录点击
            this.root.click();

        },
        initializeElements: function () {
            var eles = systemManage.Eles;
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

	global.systemManage = systemManage;/// 将构造函数挂在window上，那么在外部也能访问闭包内的属性，相当于对外暴露了一个接口

    $(function(){
        var obj = new systemManage(); 
        global.obj = obj;
    });


})(this.jQuery, this, this.jQuery(document));
