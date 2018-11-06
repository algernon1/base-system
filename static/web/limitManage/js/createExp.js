
	



(function($, global, doc){
    'use strict';

    var globalFunctionId = "";
    var orgId = GetQueryString("orgId");//组织id
    var orgName = decodeURI(GetQueryString("orgName"));//组织名称====中文转义
    var createExp = function(options){//构造器
        options = options || {};
        this.initializeElements();//初始化属性
        this.eventsMap = {//时间集合
            "click .deleteOrg":"clickDeleteOrg",
            "click .deleteAccount":"clickDeleteAccount",
            "click .deleteRole":"clickDeleteRole",
            "click #addOrgCondi":"clickAddOrgCondi",
            "click #addcondi-btn":"clickAddcondiBtn",
            "click #save":"clickSave",
            "click #cancel":"clickCancel"

        };
        this.initialization();
    }

    createExp.Eles = {// 定义构造函数静态属性，挂载所有选择器的属性0
        "orgList":"#orgList",
        "accountList":"#accountList",
        "roleList":"#roleList",
        "fieldList":"#field-list",
        "fieldListTable":"#field-list-table",
        "addcondiBtn":"#addcondi-btn",//添加条件
        "conditionCloneRow":"#condition-cloneRow",
        "orgConditionUi":"#org-condition-ui",
        "accountConditionUi":"#account-condition-ui",
        "roleConditionUi":"#role-condition-ui",
        "save":"#save",
        "cancel":"#cancel",
        "createExp":"#createExp"


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
        },
        removeExistData: function(id,arr){

            for(var i=0;i<arr.length;i++){
                if(arr[i].id == id){
                    var bol = false;
                    if(arr.length == 1){
                        bol= confirm("删除该条数据对应下面得权限条件也将删除！")
                    }
                    if(bol || arr.length >1 ){
                        arr.splice(i,1);
                        if(bol){
                            $(createExp.Eles.orgConditionUi).find("#cloneRow").remove();
                        }
                    }
                    break;
                }
            }
            return arr;
        },
        clickLeftFunc: function(e,_this,name){

            //if(bol && _this[0].tagName != "INPUT")return;

            if(_this[0].tagName == "A" || _this[0].tagName == "INPUT"){
                if(_this.parent().children().eq(1)[0].tagName != "INPUT")return;


                if(_this[0].tagName == "INPUT" ){
                    if(_this.prop("checked")){
                        $(createExp.Eles[name])[0].data.rspBody.resultData.push(_this.parent()[0].data);
                    }else{
                        $(createExp.Eles[name])[0].data.rspBody.resultData = utils.removeExistData(_this.parent()[0].data.id,$(createExp.Eles[name])[0].data.rspBody.resultData)

                    }
                }else{

                    if(_this.prev().prop("checked")){

                        _this.prev().prop("checked",false);
                        $(createExp.Eles[name])[0].data.rspBody.resultData = utils.removeExistData(_this.parent()[0].data.id,$(createExp.Eles[name])[0].data.rspBody.resultData)

                    }else{

                        _this.prev().prop("checked",true);
                        $(createExp.Eles[name])[0].data.rspBody.resultData.push(_this.parent()[0].data);

                    }
                }
                document.body.jsCtrl.ctrl = $(createExp.Eles[name])[0];
                document.body.jsCtrl.init();
            }
        },
        setSelect:function(cloneRow,condiArr,n){

            for(var i=0;i<condiArr[n-1].condition.length;i++){
                cloneRow.find("select").append("<option>"+condiArr[n-1].condition[i]+"</option>")
            };
            cloneRow.find("input").addClass("required");//
            switch(n){
                case 4:
                    cloneRow.find("input").addClass("Wdate").attr("onfocus","WdatePicker({dateFmt:'yyyy-MM-dd'})");
                    break;
                case 5:
                    cloneRow.find("input").addClass("Wdate").attr("onfocus","WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})")
                    break;
                case 6:
                    cloneRow.find("input").addClass("Wdate").attr("onfocus","WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})");
                    break;
                case 7:
                    cloneRow.find("input").addClass("Wdate").attr("onfocus","WdatePicker({dateFmt:'HH:mm:ss'})");
                default://1,2,3,8
                    break;
            }
        },
        getReqparam:function(options){//arr,arr1,reqParam

            var reqParam = {
                "orgIds":[],
                "orgConfig":[],
                "acctIds":[],
                "acctConfig":[],
                "roleIds":[],
                "roleConfig":[],
                "tableId":GetQueryString("tableId")

            };
            var arrReqName = options.arrReqName;
            var arrIds = options.arrIds;

            // var reqParam = utils.getReqparam({
            //     "arrReqName":["orgIds","acctIds","roleIds","orgConfig","acctConfig","roleConfig"],
            //     "arrIds":["orgList","accountList","roleList","orgConfig","acctConfig","roleConfig"]
            // })
            //得到组织的保存数据
            for(var n=0;n<3;n++){
                var aSelectDom = $("#"+[arrIds[n]]).find("#cloneRow");
                for(var i=0;i<aSelectDom.length;i++){
                    reqParam[arrReqName[n]].push(aSelectDom.eq(i)[0].jsonData.id);
                }
            };

            for(var n=3;n<6;n++){
                var aCondis =  $("#"+[arrIds[n]]).find("#cloneRow");
                for(var i=0;i<aCondis.length;i++){
                    var condiInfo = {}
                    condiInfo.expressionType = utils.matchType(aCondis.eq(i).find("option:selected").text());
                    condiInfo.fieldId = aCondis.eq(i)[0].jsonData.fieldId;
                    condiInfo.fieldValue = aCondis.eq(i).find(".createExp-addcondi__input").val();
                    condiInfo.tableName = aCondis.eq(i)[0].jsonData.tableName;
                    reqParam[arrReqName[n]].push(condiInfo);
                }
            };
            return reqParam;
        },
        matchType:function(str){
            var arr = [">",  "<",  "=",   "<=",    ">=",  "!="  ];
            for(var i=0;i<arr.length;i++){
                if(str == arr[i])return i+1;
            };
        }

    };


    createExp.prototype = {
        constructor:createExp,
        initialization:function(){
            this.initData();

            this.initWidgets();//初始化组件
            this.bindEvent(this.eventsMap);//绑定事件

        },
        initData: function(){
            var peId = GetQueryString("powerExpressionId");

            //请求左侧组织数据
            getAjaxResultNew({
                "strPath":"/orgInfo/getPwerTreeOrgInfo",
                "method":"post",
                "param":{"powerExpressionId":peId},
                "asyncType":false,
                "obj":{
                    "orgList":this.orgList
                },
                callbackMethod:function(data){
                    data = JSON.parse(data);
                    var orgTreeList = new treeCheck();
                    orgTreeList.loopLoad(
                        {
                            "data":data.rspBody.children,
                            "parentDom":$("#orgListBox"),
                            "isNeedCheck":true,
                            "showName":"orgName",
                            "parentId":"orgListBox",
                            clickFunc:function(e) {

                                utils.clickLeftFunc(e,utils.getDom(e),"orgList");

                            }
                        }
                    );
                },
            });

             //请求左侧用户数据
            getAjaxResultNew({
                "strPath":"/orgInfo/getPwerTreeAcctInfo",
                "method":"post",
                "param":{"powerExpressionId":peId},
                "asyncType":false,
                "obj":{
                    "accountList":this.accountList
                },
                callbackMethod:function(data){
                    data = JSON.parse(data);
                    var accountTreeList = new treeCheck();
                    accountTreeList.loopLoad(
                        {
                            "data":data.rspBody.children,
                            "parentDom":$("#accountListBox"),
                            "isNeedCheck":true,
                            "showName":"orgName",
                            "parentId":"accountListBox",
                            "notAllInputId":"type",
                            clickFunc:function(e) {

                                utils.clickLeftFunc(e,utils.getDom(e),"accountList");

                            }
                        }
                    );
                }
            });

             //请求左侧角色数据
            getAjaxResultNew({
                "strPath":"/orgInfo/getPwerTreeRoleInfo",
                "method":"post",
                "param":{"powerExpressionId":peId},
                "asyncType":false,
                "obj":{
                    "roleList":this.roleList
                },
                callbackMethod:function(data){
                    data = JSON.parse(data);
                    var accountTreeList = new treeCheck();
                    accountTreeList.loopLoad(
                        {
                            "data":data.rspBody.children,
                            "parentDom":$("#roleListBox"),
                            "isNeedCheck":true,
                            "showName":"orgName",
                            "parentId":"roleListBox",
                            "notAllInputId":"type",
                            clickFunc:function(e) {

                                utils.clickLeftFunc(e,utils.getDom(e),"roleList");

                            }
                        }
                    );
                }
            });

            //请求右侧数据
            getAjaxResultNew({
                "strPath":"/powerExpression/getdetails",
                "method":"post",
                "param":{"powerExpressionId":peId},
                "asyncType":false,
                "obj":{
                    "orgList":this.orgList,
                    "accountList":this.accountList,
                    "roleList":this.roleList
                },
                callbackMethod:function(data){
                    data = JSON.parse(data);

                    //已选组织初始化
                    var orgHasChooseData = {
                        "rspBody":{
                            "resultData":data.orgPrivRelations||[] 
                        }
                    }
                    this.obj.orgList[0].data = orgHasChooseData;
                    this.obj.orgList.attr({"comType":"standardTableCtrl"})
                    document.body.jsCtrl.ctrl = this.obj.orgList[0];
                    document.body.jsCtrl.init();

                    //已选用户初始化
                    var accountHasChooseData = {
                        "rspBody":{
                            "resultData":data.accountPrivRelations||[] 
                        }
                    }
                    this.obj.accountList[0].data = accountHasChooseData;
                    this.obj.accountList.attr({"comType":"standardTableCtrl"})
                    document.body.jsCtrl.ctrl = this.obj.accountList[0];
                    document.body.jsCtrl.init();

                    //已选角色初始化
                    var roleHasChooseData = {
                        "rspBody":{
                            "resultData":data.rolePrivRelations||[] 
                        }
                    }
                    this.obj.roleList[0].data = roleHasChooseData;
                    this.obj.roleList.attr({"comType":"standardTableCtrl"})
                    document.body.jsCtrl.ctrl = this.obj.roleList[0];
                    document.body.jsCtrl.init();

                }
            });

        },
        clickDeleteOrg:function(e){//右侧删除组织
            var id = utils.getDom(e).parents("li")[0].jsonData.id;
            var arr = this.orgList[0].data.rspBody.resultData;
            this.orgList[0].data.rspBody.resultData = utils.removeExistData(id,arr)
            this.orgList.attr({"comType":"standardTableCtrl"});
            document.body.jsCtrl.ctrl = this.orgList[0];
            document.body.jsCtrl.init();
            $("li[_id="+utils.getDom(e).parents("li")[0].jsonData.id+"]").find("input").eq(0).prop("checked",false)
        },
        clickDeleteAccount:function(e){//右侧删除用户
            var id = utils.getDom(e).parents("li")[0].jsonData.id;
            var arr = this.accountList[0].data.rspBody.resultData;
            this.accountList[0].data.rspBody.resultData = utils.removeExistData(id,arr)
            this.accountList.attr({"comType":"standardTableCtrl"})
            document.body.jsCtrl.ctrl = this.accountList[0];
            document.body.jsCtrl.init();
            $("li[_id="+utils.getDom(e).parents("li")[0].jsonData.id+"]").find("input").eq(0).prop("checked",false)
        },
        clickDeleteRole:function(e){//右侧删除用户
            var id = utils.getDom(e).parents("li")[0].jsonData.id;
            var arr = this.roleList[0].data.rspBody.resultData;
            this.roleList[0].data.rspBody.resultData = utils.removeExistData(id,arr)
            this.roleList.attr({"comType":"standardTableCtrl"})
            document.body.jsCtrl.ctrl = this.roletList[0];
            document.body.jsCtrl.init();
            $("li[_id="+utils.getDom(e).parents("li")[0].jsonData.id+"]").find("input").eq(0).prop("checked",false)
        },
        clickAddOrgCondi:function(e){
            if(this.orgList.find("#cloneRow").length==0){
                alert("请先添加组织！");
                return;
            }
            openWin(500, 300, "field-list", true);
            var reqParam = {"tableId":GetQueryString("tableId")}
            this.fieldListTable.attr({"reqParam":JSON.stringify(reqParam),"comtype":"standardTableCtrl"});
            document.body.jsCtrl.ctrl = this.fieldListTable[0];
            document.body.jsCtrl.init();
        },
        clickAddcondiBtn:function(e){
            var data = utils.getDom(e).parents("tr")[0].jsonData;
            var condiArr = [
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":[">",  "<",  "=",   "<=",    ">=",  "!="  ]},
                {"condition":["=",  "!="]},
                {"condition":["=",  "!="]},
            ];

            var cloneRow = this.conditionCloneRow.clone();
            cloneRow[0].id = "cloneRow";
            cloneRow[0].style.display = "";
            cloneRow[0].jsonData = data;

            utils.setSelect(cloneRow,condiArr,data.fieldType);

            cloneRow.insertBefore(this.conditionCloneRow);
            cloneRow.find("#fieldName").text(data.fieldName);
            cloneRow.find("select").chosen({
                //disable_search_threshold: 5,
                search_contains: true,
                width: "100px",
                no_results_text: "没有匹配结果!",
                enable_split_word_search: false,
                placeholder_text_single: '请选择'
            });
            closePopupWin();

        },
        clickSave:function(e){
            var reqParam = utils.getReqparam({
                "arrReqName":["orgIds","acctIds","roleIds","orgConfig","acctConfig","roleConfig"],
                "arrIds":["orgList","accountList","roleList","org-condition-ui","account-condition-ui","role-condition-ui"]
            });
            initValidate(this.createExp[0]);
            var obj = new clsValidateCtrl();  
            if(obj.validateAll())
            {

                //保存权限
                getAjaxResultNew({
                    "strPath":"/powerExpression/save",
                    "method":"post",
                    "param":reqParam,
                    "asyncType":false,
                    "obj":{
                        "orgList":this.orgList
                    },
                    callbackMethod:function(data){
                        data = JSON.parse(data);
                        if(data.retCode == "0000000"){
                            console.log(data);
                            alert("保存成功！")
                        };
                    }
                });
            }


        },
        clickCancel:function(e){

        },




        initializeElements: function () {
            var eles = createExp.Eles;
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

    global.createExp = createExp;/// 将构造函数挂在window上，那么在外部也能访问闭包内的属性，相当于对外暴露了一个接口

    $(function(){
        var obj = new createExp(); 
        //将实例挂在window上
        //global.obj = obj;
    });


})(this.jQuery, this, this.jQuery(document));