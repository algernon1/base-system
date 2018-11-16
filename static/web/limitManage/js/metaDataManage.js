function clsThirdLevelTableCtrl$grandChildProgress(jsonCItem, cloneRow, jsonItem) {
    
}
function clsThirdLevelTableCtrl$childProgress(jsonCItem, cloneRow, jsonItem) {
    switch(jsonCItem.type){
        case 1:
            jsonCItem.typeStr = "按组织";
            break;
        case 2:
            jsonCItem.typeStr = "按用户";
            break;
        case 3:
            jsonCItem.typeStr = "按角色";
            break;
    }
}
function clsSearchBtnCtrl$after(jsonCond) {
    jsonCond.sysId = $(metaDataManage.Eles.sysList).find("option:selected").val();
    return jsonCond;
}

(function($, global, doc){
	'use strict';

    var globalFunctionId = "";
    var orgId = GetQueryString("orgId");//组织id
    var orgName = decodeURI(GetQueryString("orgName"));//组织名称====中文转义
	var metaDataManage = function(options){//构造器
		options = options || {};
        this.initializeElements();//初始化属性
		this.eventsMap = {//时间集合
            'change #sysList':"changeSysList",//切换查询条件
            'change #conditionSelect':"changeCondition",//切换查询条件
            'click #createTable':"clickCreateTable",
            "click #createTableSure":"clickCreateTableSure",
            "click #createTableCancel":"clickCreateTableCancel",
            "click #deleteTable":"clickDeleteTable",
            "click #editTable":"clickEditTable",
            "click #tableList #createOrEditExp":"clickCreateOrEditExp",
            "click #checkExp":"clickCheckExp",
            "click #metaData-child-table #deletePermission":"clickDeletePermission",//删除权限
            "click #metaData-child-table #checkPermission":"clickCheckPermissionn",//查看权限
            "click #checkField":"clickCheckField",//查看表字段
            "click #createField":"clickCreateField",//新增字段
            "click #createFieldSure":"clickCreateFieldSure",//保存字段
            "click #createFieldCancel":"clickCreateFieldCancel",//取消保存字段
            "click #filedList #editField":"clickEditField",//编辑字段
            "click #filedList #deleteField":"clickDeleteField"//删除字段

		};
		this.initialization();
	}

	metaDataManage.Eles = {// 定义构造函数静态属性，挂载所有选择器的属性
		"comSelect":".comSelect",
		"conditionSelect":"#conditionSelect",
		"sysList":"#sysList",
		"tableList":"#tableList",
		"createTable":"#createTable",
		"searchBox":"#searchBox",
		"searchBtn":"#searchBtn",
		"metaDataCreate":"#metaData-create",
		"deleteTable":"#deleteTable",
        "metaDataChildTable":"#metaData-child-table",
        "filedList":"#filedList",
        "metaDataCreateField":"#metaData-create-field",
        "fieldType":"#fieldType",
        "tabMenu":"#tab-menu"

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
        clearValue: function(dom){
            $(dom).find("input").val("");
            $(dom).find("#status").prop("checked",true);
            if($(dom).find("select")){
                $(dom).find("select option").prop("checked",false);
                $(dom).find("select option").eq(0).prop("checked",true);
                $(dom).find("select").trigger('chosen:updated');
            }
        }
	}


	metaDataManage.prototype = {
		constructor:metaDataManage,
		initialization:function(){
            this.initData();
            
            this.initWidgets();//初始化组件
            this.bindEvent(this.eventsMap);//绑定事件


            $(this.comSelect).chosen({
			    //disable_search_threshold: 5,
			    search_contains: true,
			    width: this.comSelect[0].style.width,
			    no_results_text: "没有匹配结果!",
			    enable_split_word_search: false,
			    placeholder_text_single: '请选择'
			});
		},
        initializeElements: function () {
            var eles = metaDataManage.Eles;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
        },
        initData: function(){

        	var reqParam = {"sysId":this.sysList.find("option:selected").val()};
        	this.tableList.attr({"reqParam":JSON.stringify(reqParam),"comtype":"standardTableCtrl"});
            document.body.jsCtrl.ctrl = this.tableList[0];
            document.body.jsCtrl.init();

            var tableId = "";
            if(this.tableList.find("tr").eq(1).attr("id") == "cloneRow"){
                tableId = this.tableList.find("tr").eq(1)[0].jsonData.id;
                this.tableList.find("tr").eq(1).addClass("grayBg")
            }
            this.metaDataChildTable.attr({
                "reqParam":JSON.stringify({"tableId":tableId}),
                "comtype":"thirdLevelTableCtrl"
            });
                

            document.body.jsCtrl.ctrl = this.metaDataChildTable[0];
            document.body.jsCtrl.init();


            this.filedList.attr({
                "reqParam":JSON.stringify({"tableId":tableId}),
                "comtype":"standardTableCtrl"
            });
            
            document.body.jsCtrl.ctrl = this.filedList[0];
            document.body.jsCtrl.init();

        },
        changeSysList: function(){
            this.initData();
        },
        changeCondition: function(e){
        	//utils.getDom(e).find("option:selected").text()
        	var text = utils.getDom(e).find("option:selected").text();
        	var conditionText = this.searchBox.find(".metaData-search__input").eq(0);
        	conditionText.val("");
        	if(text == "表名"){
        		conditionText.attr("id","tableName");
        		this.searchBtn.attr("cond","tableName");
        	}else if(text == "表名CODE"){
        		conditionText.attr("id","tableNameCode");
        		this.searchBtn.attr("cond","tableNameCode");
        	}
        	conditionText.attr("placeholder","请输入" + text);
            document.body.jsCtrl.ctrl = this.searchBtn[0];
            document.body.jsCtrl.init();
        },
        clickCreateTable: function(e){
            this.metaDataCreate[0].jsonData = null;
            utils.clearValue(this.metaDataCreate[0]);
        	openWin(500, 300, "metaData-create", true);
        },
        clickCreateTableSure: function(e){
        	initValidate(this.metaDataCreate[0]);
            var obj = new clsValidateCtrl();  
            if(obj.validateAll())
            {
            	var status = null;
            	if(this.metaDataCreate.find("#status").prop("checked")){
            		status =1;
            	}else{
            		status = 0;
            	}
	        	var reqParam = {
	        		"tableName":this.metaDataCreate.find("#tableName").val(),
	        		"tableNameCode":this.metaDataCreate.find("#tableNameCode").val(),
	        		"tableDescribe":this.metaDataCreate.find("#tableDescribe").val(),
	        		"keyCode":this.metaDataCreate.find("#keyCode").val(),
	        		"keyType":this.metaDataCreate.find("#keyType").val(),
	        		"keyName":this.metaDataCreate.find("#keyName").val(),
	        		"status":status,
	        		"sysId":this.sysList.find("option:selected").val()
	        	};
                if(utils.getDom(e).parents("#metaData-create").find(".title h2").text() == "新建表"){//新建表
                    getAjaxResultNew({
                        "strPath":"/theMetadata/save", 
                        "method":"post", 
                        "param":reqParam,
                        "ctrl":this.tableList,
                        callbackMethod:function(data){
                            console.log(this.ctrl)
                            data = JSON.parse(data);
                            if(data.retCode == "0000000"){
                                closePopupWin();
                                document.body.jsCtrl.ctrl = this.ctrl[0];
                                document.body.jsCtrl.init();
                            }
                        }

                    });
                }else if(utils.getDom(e).parents("#metaData-create").find(".title h2").text() == "编辑表"){//编辑表
                    reqParam.id = this.metaDataCreate[0].jsonData.id;
                    getAjaxResultNew({
                        "strPath":"/theMetadata/update", 
                        "method":"post", 
                        "param":reqParam,
                        "ctrl":this.tableList,
                        callbackMethod:function(data){
                            data = JSON.parse(data);
                            if(data.retCode == "0000000"){
                                closePopupWin();
                                document.body.jsCtrl.ctrl = this.ctrl[0];
                                document.body.jsCtrl.init();
                            }
                        }

                    });
                }
            }
        },
        clickCreateTableCancel: function(){
        	closePopupWin();
        },
        clickDeleteTable: function(e){
        	var reqParam = {};
        	reqParam.id = utils.getDom(e).parents("#cloneRow")[0].jsonData.id;

        	getAjaxResultNew({
                "strPath":"/theMetadata/delete", 
                "method":"post", 
                "param":reqParam, 
                "ctrl":this.tableList,
                callbackMethod: function(data){
    	        	data = JSON.parse(data);
            		if(data.retCode == "0000000"){
    		            document.body.jsCtrl.ctrl = this.ctrl[0];
    		            document.body.jsCtrl.init();
            		}
            	}
            });
        },
        clickEditTable: function(e){
            this.metaDataCreate.find(".title h2").text("编辑表");
            openWin(500, 300, "metaData-create", true);
            this.metaDataCreate[0].jsonData = utils.getDom(e).parents("#cloneRow")[0].jsonData;
            utils.setValueGlobal(utils.getDom(e).parents("#cloneRow")[0].jsonData,this.metaDataCreate[0])

        },
        clickCreateOrEditExp: function(e){
            var data = utils.getDom(e).parents("tr")[0].jsonData
            window.location.href = "./createExp.html?tableId=" + data.id
        },
        clickCheckExp: function(e){
            this.tabMenu.find("li[nidx=0]").click();
            this.metaDataChildTable.attr("reqParam",JSON.stringify({"tableId":utils.getDom(e).parents("#cloneRow")[0].jsonData.id}))
            document.body.jsCtrl.ctrl = this.metaDataChildTable[0];
            document.body.jsCtrl.init();
            
            utils.getDom(e).parents("table").find("tr").removeClass("grayBg");
            utils.getDom(e).parents("tr").addClass("grayBg");

        },
        clickDeletePermission:function(e){//删除权限
            var data = utils.getDom(e).parents("tr")[0].jsonData;
            getAjaxResultNew({
                "strPath":"/powerExpression/delete", 
                "method":"post", 
                "param":{"powerExpressionId":data.powerExpressionId}, 
                "ctrl":this.metaDataChildTable,
                callbackMethod: function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        document.body.jsCtrl.ctrl = this.ctrl[0];
                        document.body.jsCtrl.init();
                    }
                }
            });
        },
        clickCheckPermissionn:function(e){//查看权限
            var data = utils.getDom(e).parents("tr")[0].jsonData;
            window.location.href = "./createExp.html?tableId=" + data.tableId + "&powerExpressionId=" + data.powerExpressionId
        },


        clickCheckField:function(e){//点击查看字段按钮
            this.tabMenu.find("li[nidx=1]").click();
            var tableId = utils.getDom(e).parents("tr")[0].jsonData.id;
            this.filedList.attr({
                "comtype":"standardTableCtrl",
                "reqParam":JSON.stringify({"tableId":tableId}),
                "reqPath":"/metadataField/findpageresult"
            })
            document.body.jsCtrl.ctrl = this.filedList[0];
            document.body.jsCtrl.init();

            utils.getDom(e).parents("table").find("tr").removeClass("grayBg");
            utils.getDom(e).parents("tr").addClass("grayBg");
        },
        clickCreateField:function(e){//点击新增字段按钮

            this.tabMenu.find("li[nidx=1]").click();
            var tableId = utils.getDom(e).parents("tr")[0].jsonData.id;
            this.metaDataCreateField[0].jsonData = utils.getDom(e).parents("tr")[0].jsonData;
            this.metaDataCreateField[0].type = "save";
            this.filedList.attr({
                "comtype":"standardTableCtrl",
                "reqParam":JSON.stringify({"tableId":tableId}),
                "reqPath":"/metadataField/findpageresult",
                "_tableId":tableId
            })

            utils.getDom(e).parents("table").find("tr").removeClass("grayBg");
            utils.getDom(e).parents("tr").addClass("grayBg");

            document.body.jsCtrl.ctrl = this.filedList[0];
            document.body.jsCtrl.init();

            utils.clearValue(this.metaDataCreateField[0])
            openWin(500, 300, "metaData-create-field", true);

            $(this.fieldType).chosen({
                //disable_search_threshold: 5,
                search_contains: true,
                width: this.fieldType[0].style.width,
                no_results_text: "没有匹配结果!",
                enable_split_word_search: false,
                placeholder_text_single: '请选择'
            });


        },
        clickCreateFieldSure:function(e){
            var status = null;
            if(this.metaDataCreateField.find("#status").prop("checked")){
                status = 1;
            }else{
                status = 0;
            }
            var reqParam = {
                "fieldCode":this.metaDataCreateField.find("#fieldCode").val(),
                "fieldDescribe":this.metaDataCreateField.find("#fieldDescribe").val(),
                "fieldLength":this.metaDataCreateField.find("#fieldLength").val(),
                "fieldName":this.metaDataCreateField.find("#fieldName").val(),
                "fieldType":this.metaDataCreateField.find("#fieldType option:selected").val(),
                "status":status,
                "tableId":this.metaDataCreateField[0].jsonData.id,
                "fieldId":this.metaDataCreateField[0].jsonData.fieldId
            };

            if(this.metaDataCreateField[0].type == "save"){
                var reqPath = "/metadataField/save";
            }else{
                var reqPath = "/metadataField/update";
            }

            getAjaxResultNew({
                "strPath":reqPath, 
                "method":"post", 
                "param":reqParam, 
                "ctrl":this.filedList,
                callbackMethod: function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        document.body.jsCtrl.ctrl = this.ctrl[0];
                        document.body.jsCtrl.init();
                        closePopupWin();

                    }
                }
            });
        },
        clickCreateFieldCancel:function(e){
            closePopupWin();
        },
        clickEditField:function(e){

            openWin(500, 300, "metaData-create-field", true);
            setValue4Desc(utils.getDom(e).parents("#cloneRow")[0].jsonData,this.metaDataCreateField[0]);
            this.metaDataCreateField[0].jsonData = utils.getDom(e).parents("#cloneRow")[0].jsonData;
            this.metaDataCreateField[0].type = "update";
            $(this.fieldType).chosen({
                //disable_search_threshold: 5,
                search_contains: true,
                width: this.fieldType[0].style.width,
                no_results_text: "没有匹配结果!",
                enable_split_word_search: false,
                placeholder_text_single: '请选择'
            });

        },
        clickDeleteField:function(e){

            getAjaxResultNew({
                "strPath":"/metadataField/delete", 
                "method":"post", 
                "param":{"fieldId":utils.getDom(e).parents("tr")[0].jsonData.fieldId}, 
                "ctrl":this.filedList,
                callbackMethod: function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        alert("删除成功！")
                        document.body.jsCtrl.ctrl = this.ctrl[0];
                        document.body.jsCtrl.init();
                        closePopupWin();
                    }
                }
            });
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

	global.metaDataManage = metaDataManage;/// 将构造函数挂在window上，那么在外部也能访问闭包内的属性，相当于对外暴露了一个接口

    $(function(){
        var obj = new metaDataManage(); 
        //将实例挂在window上
        //global.obj = obj;
    });


})(this.jQuery, this, this.jQuery(document));