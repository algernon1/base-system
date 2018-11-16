function clsThirdLevelTableCtrl$grandChildProgress(jsonCItem, cloneRow, jsonItem) {

    //jsonCItem

}




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
            "click #addAccountCondi":"clickAddAccountCondi",
            "click #addRoleCondi":"clickAddRoleCondi",
            "click #addcondi-btn":"clickAddcondiBtn",
            "click #save":"clickSave",
            //"click #cancel":"clickCancel"

        };
        this.initialization();
    }

    createExp.Eles = {// 定义构造函数静态属性，挂载所有选择器的属性0
        "tabMenu":"#tab-menu",

        "orgListBox":"#orgListBox",
        "accountListBox":"#accountListBox",
        "roleListBox":"#roleListBox",


        "orgList":"#orgList",
        "accountList":"#accountList",
        "roleList":"#roleList",
        "fieldList":"#field-list",
        "fieldListTable":"#field-list-table",
        "addcondiBtn":"#addcondi-btn",//添加条件

        "orgCondiCloneRow":"#org-condition-ui #condition-cloneRow",
        "accountCondiCloneRow":"#account-condition-ui #condition-cloneRow",
        "roleCondiCloneRow":"#role-condition-ui #condition-cloneRow",

        "orgConditionUi":"#org-condition-ui",
        "accountConditionUi":"#account-condition-ui",
        "roleConditionUi":"#role-condition-ui",
        "save":"#save",
        //"cancel":"#cancel",
        "createExp":"#createExp",
        "tabContentOne":"#tabContentOne",
        "tabContentTwo":"#tabContentTwo",
        "tabContentThree":"#tabContentThree",


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
                // if(arr[i].orgId == id){
                //     utils.removeDataDetail(id,arr,arr[i].orgId)
                // }else if(arr[i].acctId == id){
                //     utils.removeDataDetail(id,arr,arr[i].acctId )
                // }else if(arr[i].roleId == id){
                //     utils.removeDataDetail(id,arr,arr[i].roleId)
                // }else{
                //     utils.removeDataDetail(id,arr)
                // }

                if(arr[i].id == id){
                    var bol = false;
                    if(arr.length == 1){
                        bol= confirm("删除该条数据对应下面得权限条件也将删除！")
                    }
                    if(bol || arr.length >1 ){
                        arr.splice(i,1);
                        if(bol){
                            var nidx = $(createExp.Eles.tabMenu).find(".tabTitLi").attr("nidx");
                            if( nidx == 0){//组织
                                $(createExp.Eles.orgConditionUi).find("#cloneRow").remove();
                            }else if(nidx == 1){//用户
                                $(createExp.Eles.accountConditionUi).find("#cloneRow").remove();
                            }else{//角色
                                $(createExp.Eles.roleConditionUi).find("#cloneRow").remove();
                            }

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
        setSelect:function(cloneRow,condiArr,n,selectedNum){

            for(var i=0;i<condiArr[n-1].condition.length;i++){
                if(utils.matchSymbol(selectedNum) == condiArr[n-1].condition[i]){
                    cloneRow.find("select").append("<option selected>"+condiArr[n-1].condition[i]+"</option>")
                }else{
                    cloneRow.find("select").append("<option>"+condiArr[n-1].condition[i]+"</option>")
                }
            };
            cloneRow.find("input").addClass("required").val(cloneRow[0].jsonData.fieldValue);//
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
                "tableId":GetQueryString("tableId"),
                "powerExpressionId":GetQueryString("powerExpressionId")

            };
            var arrReqName = options.arrReqName;
            var arrIds = options.arrIds;

            //得到组织的保存数据
            for(var n=0;n<3;n++){
                var aSelectDom = $("#"+[arrIds[n]]).find("li");
                for(var i=0;i<aSelectDom.length-1;i++){
                    reqParam[arrReqName[n]].push(aSelectDom.eq(i)[0].jsonData.id);
                };
            };

            for(var n=3;n<6;n++){
                var aCondis =  $("#"+[arrIds[n]]).find("#cloneRow");
                for(var i=0;i<aCondis.length;i++){
                    var condiInfo = {}
                    condiInfo.expressionType = utils.matchType(aCondis.eq(i).find("option:selected").text());
                    condiInfo.fieldId = aCondis.eq(i)[0].jsonData.fieldId;
                    condiInfo.fieldValue = aCondis.eq(i).find(".createExp-addcondi__input").val();
                    condiInfo.tableName = aCondis.eq(i)[0].jsonData.tableName;
                    condiInfo.expression = aCondis.eq(i).find("#fieldName").text()+aCondis.eq(i).find("option:selected").text()+condiInfo.fieldValue;
                    reqParam[arrReqName[n]].push(condiInfo);
                };
            };
            return reqParam;
        },
        matchType:function(str){
            var arr = [">",  "<",  "=",   "<=",    ">=",  "!="  ];
            for(var i=0;i<arr.length;i++){
                if(str == arr[i])return i+1;
            };
        },
        matchSymbol:function(num){
            var arr = [">",  "<",  "=",   "<=",    ">=",  "!="  ];
            for(var i=0;i<arr.length;i++){
                if(num == i+1)return arr[i];
            };
        },
        comDelete:function(dom,e){

            var id = utils.getDom(e).parents("li")[0].jsonData.id;
            var arr = dom[0].data.rspBody.resultData;
            var num=arr.length,num1=0;
            dom[0].data.rspBody.resultData = utils.removeExistData(id,arr)
            num1=dom[0].data.rspBody.resultData.length;
            dom.attr({"comType":"standardTableCtrl"});
            document.body.jsCtrl.ctrl = dom[0];
            document.body.jsCtrl.init();
            if(num != num1){
                $("li[_id="+utils.getDom(e).parents("li")[0].jsonData.id+"]").find("input").eq(0).prop("checked",false)
            };
        },
        comAddCondi:function(dom,type){

            if(dom.find("#cloneRow").length==0){
                
                if(type == 1){//组织
                    alert("请先添加组织！");
                }else if(type ==2){//用户
                    alert("请先添加用户！");
                }else{//角色
                    alert("请先添加角色！");
                }
                return;
            }
            openWin(500, 300, "field-list", true);
            var reqParam = {"tableId":GetQueryString("tableId")}
            $(createExp.Eles.fieldListTable).attr({"reqParam":JSON.stringify(reqParam),"comtype":"standardTableCtrl"});
            document.body.jsCtrl.ctrl = $(createExp.Eles.fieldListTable)[0];
            document.body.jsCtrl.init();
        },
        dataEcho:function(arr){
            for(var i=0;i<arr.length;i++){

                var comHasChooseData = {
                    "rspBody":{
                        "resultData":arr[i].data
                    }
                };
                for(var j=0;j<arr[i].data.length;j++){
                    if(i==0){
                        $(createExp.Eles.orgListBox).find("li[_id="+arr[i].data[j].orgId+"] input").eq(0).prop("checked",true)
                    }else if(i==1){
                        $(createExp.Eles.accountListBox).find("li[_id="+arr[i].data[j].acctId+"] input").eq(0).prop("checked",true)
                    }else{
                        $(createExp.Eles.roleListBox).find("li[_id="+arr[i].data[j].roleId+"] input").eq(0).prop("checked",true)
                    }
                };
                arr[i].ctrl[0].data = comHasChooseData;
                arr[i].ctrl.attr({"comType":"standardTableCtrl"})
                document.body.jsCtrl.ctrl = arr[i].ctrl[0];
                document.body.jsCtrl.init();

                if(arr[i].data1){
                    for(var k=0;k<arr[i].data1.length;k++){
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


                        if($(".tabMenu-two .tabTitLi").attr("nidx") == 0 ){
                            var cloneRow = $(createExp.Eles.orgCondiCloneRow).clone();
                        }else if($(".tabMenu-two .tabTitLi").attr("nidx") == 1 ){
                            var cloneRow = $(createExp.Eles.accountCondiCloneRow).clone();
                        }else if($(".tabMenu-two .tabTitLi").attr("nidx") == 2 ){
                            var cloneRow = $(createExp.Eles.roleCondiCloneRow).clone();
                        };

                        cloneRow[0].id = "cloneRow";
                        cloneRow[0].style.display = "";
                        cloneRow[0].jsonData = arr[i].data1[k];

                        utils.setSelect(cloneRow,condiArr,arr[i].data1[k].fieldType,arr[i].data1[k].expressionType);

                              
                        if(arr[i].ctrl[0].id == "orgList" ){
                            cloneRow.insertBefore($(createExp.Eles.orgCondiCloneRow));
                        }else if(arr[i].ctrl[0].id == "accountList" ){
                            cloneRow.insertBefore($(createExp.Eles.accountCondiCloneRow));
                        }else if(arr[i].ctrl[0].id == "roleList" ){
                            cloneRow.insertBefore($(createExp.Eles.roleCondiCloneRow));
                        };

                        cloneRow.find("#fieldName").text(arr[i].data1[k].fieldName);
                        cloneRow.find("select").chosen({
                            //disable_search_threshold: 5,
                            search_contains: true,
                            width: "100px",
                            no_results_text: "没有匹配结果!",
                            enable_split_word_search: false,
                            placeholder_text_single: '请选择'
                        });
                    };
                }
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
                "ctrl":{
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
                            "showName":["orgName"],
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
                "ctrl":{
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
                            "showName":["orgName","acctTitle"],
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
                "ctrl":{
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
                            "showName":["orgName","roleTitle"],
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
                "ctrl":{
                    "orgList":this.orgList,
                    "accountList":this.accountList,
                    "roleList":this.roleList
                },
                callbackMethod:function(data){
                    data = JSON.parse(data);


                    //数据回显
                    if(data.rspBody){
                        utils.dataEcho([
                            {"data":data.rspBody.orgPrivRelations,"data1":data.rspBody.orgConfig,"ctrl":this.ctrl.orgList},
                            {"data":data.rspBody.accountPrivRelations,"data1":data.rspBody.acctConfig,"ctrl":this.ctrl.accountList},
                            {"data":data.rspBody.rolePrivRelations,"data1":data.rspBody.roleConfig,"ctrl":this.ctrl.roleList}
                        ]);
                    }else{
                        utils.dataEcho([
                            {"data":[],"ctrl":this.ctrl.orgList},
                            {"data":[],"ctrl":this.ctrl.accountList},
                            {"data":[],"ctrl":this.ctrl.roleList}
                        ]);
                    }

                    // //已选组织初始化
                    // var orgHasChooseData = {
                    //     "rspBody":{
                    //         "resultData":data.rspBody.orgPrivRelations||[] 
                    //     }
                    // }
                    // this.ctrl.orgList[0].data = orgHasChooseData;
                    // this.ctrl.orgList.attr({"comType":"standardTableCtrl"})
                    // document.body.jsCtrl.ctrl = this.ctrl.orgList[0];
                    // document.body.jsCtrl.init();

                    // //已选用户初始化
                    // var accountHasChooseData = {
                    //     "rspBody":{
                    //         "resultData":data.rspBody.accountPrivRelations||[] 
                    //     }
                    // }
                    // this.ctrl.accountList[0].data = accountHasChooseData;
                    // this.ctrl.accountList.attr({"comType":"standardTableCtrl"})
                    // document.body.jsCtrl.ctrl = this.ctrl.accountList[0];
                    // document.body.jsCtrl.init();

                    // //已选角色初始化
                    // var roleHasChooseData = {
                    //     "rspBody":{
                    //         "resultData":data.rspBody.rolePrivRelations||[] 
                    //     }
                    // }
                    // this.ctrl.roleList[0].data = roleHasChooseData;
                    // this.ctrl.roleList.attr({"comType":"standardTableCtrl"})
                    // document.body.jsCtrl.ctrl = this.ctrl.roleList[0];
                    // document.body.jsCtrl.init();

                }
            });

        },
        clickDeleteOrg:function(e){//右侧删除组织

            utils.comDelete(this.orgList,e)
        },
        clickDeleteAccount:function(e){//右侧删除用户

            utils.comDelete(this.accountList,e)
        },
        clickDeleteRole:function(e){//右侧删除用户

            utils.comDelete(this.roleList,e)
        },
        clickAddOrgCondi:function(e){
            utils.comAddCondi(this.orgList,1)
        },
        clickAddAccountCondi:function(e){

            utils.comAddCondi(this.accountList,2)
        },
        clickAddRoleCondi:function(e){
            utils.comAddCondi(this.roleList,3)
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


            if($(".tabMenu-two .tabTitLi").attr("nidx") == 0 ){
                var cloneRow = this.orgCondiCloneRow.clone();
            }else if($(".tabMenu-two .tabTitLi").attr("nidx") == 1 ){
                var cloneRow = this.accountCondiCloneRow.clone();
            }else if($(".tabMenu-two .tabTitLi").attr("nidx") == 2 ){
                var cloneRow = this.roleCondiCloneRow.clone();
            };

            cloneRow[0].id = "cloneRow";
            cloneRow[0].style.display = "";
            cloneRow[0].jsonData = data;

            utils.setSelect(cloneRow,condiArr,data.fieldType);

                  
            if($(".tabMenu-two .tabTitLi").attr("nidx") == 0 ){
                cloneRow.insertBefore(this.orgCondiCloneRow);
            }else if($(".tabMenu-two .tabTitLi").attr("nidx") == 1 ){
                cloneRow.insertBefore(this.accountCondiCloneRow);
            }else if($(".tabMenu-two .tabTitLi").attr("nidx") == 2 ){
                cloneRow.insertBefore(this.roleCondiCloneRow);
            };

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
                "arrReqName":["orgIds","acctIds","roleIds","orgConfig","acctConfig","roleConfig"],//入参名称
                "arrIds":["orgList","accountList","roleList","org-condition-ui","account-condition-ui","role-condition-ui"]//对应dom id名称
            });

            var obj = new clsValidateCtrl();  
            this.tabMenu.find("li[nidx=0]").click();
            initValidate(this.orgConditionUi[0]);
            if(!obj.validateAll4Ctrl(this.orgConditionUi[0])){
                return;
            }

            initValidate(this.accountConditionUi[0]);
            this.tabMenu.find("li[nidx=1]").click();
            initValidate(this.accountConditionUi[0]);
            if(!obj.validateAll4Ctrl(this.accountConditionUi[0])){
                return;
            }

            initValidate(this.roleConditionUi[0]);
            this.tabMenu.find("li[nidx=2]").click();
            initValidate(this.roleConditionUi[0]);
            if(!obj.validateAll4Ctrl(this.roleConditionUi[0])){
                return;
            }
            
            //保存权限
            if(GetQueryString("powerExpressionId")){
                var reqPath = "/powerExpression/update";
            }else{
                var reqPath = "/powerExpression/save";
            }
            getAjaxResultNew({
                "strPath":reqPath,
                "method":"post",
                "param":reqParam,
                "asyncType":false,
                "ctrl":{
                    "orgList":this.orgList
                },
                callbackMethod:function(data){
                    data = JSON.parse(data);
                    if(data.retCode == "0000000"){
                        alert("保存成功！");
                        window.location.href = "./metaDataManage.html";
                    };
                }
            });


        },
        // clickCancel:function(e){
        //     closePopupWin();
        // },




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