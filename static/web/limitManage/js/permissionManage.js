

//树形菜单渲染 
function treeCheck(){
    this.data = {};
    this.isAllChecked = null;//该属性是否把子集全选

}
treeCheck.prototype.unionChecked = function(dom){
    $(dom).click(function(){

        for(var i=0;i<$(dom).length;i++){//后期优化
            // if(){
            //  this.isAllChecked = false;//该属性是否把子集全选
            // }
        }
        //当选中或取消一个权限时，也同时选中或取消所有的下级权限
        $(this).siblings("ul").find("input").attr("checked",this.checked);

        //当选中一个权限时，也要选中所有的直接上级权限
        // if(this.checked ==true){
        //     $(this).parents("li").children("input").attr("checked",true);
        // }

        //当某一个父权限下的子权限都不选中时，该父权限也不选中
        // var elements=$(this).parent("li").parent("ul").find("input");
        // var num=elements.length;
        // /*alert(num);*/
        // var a=0;
        // for(var i=0;i<num;i++){
        //     if(elements[i].checked==false){
        //         a++;
        //     }
        //}
        // if(a==num){
        //     $(this).parent("li").parent("ul").siblings("input").attr("checked",false);
        // }
    });
}
treeCheck.prototype.loopLoad = function(options){//递归,无限遍历下级dom树
    //数据， 父级dom,  是否是选中,  是否有checkbox框
    var data = options.data;//数据
    var parentDom = options.parentDom;//父级dom
    var isNeedCheck = options.isNeedCheck;//是否有checkbox框
    var parentId = options.parentId;//父级id
    var showName = options.showName;//显示的文本字段名
    //var clickFunc = options.clickFunc;//点击树的某一行执行的函数
    var id = options.id;//当前选中的行数据主键值
    var className = options.className;//选中状态的class名称
    //var globalFunctionId = options.globalFunctionId;
    //options.notAllInputId //该tree部分有checkbox，  //
    if(data){
        var oUl = document.createElement("ul");
        if( parentDom.attr("id") && parentDom.attr("id") == parentId ){
            $("#" + parentId).empty();
            oUl.id = "navigation";
            parentDom.append(oUl);
        }else{
            //if(!bol)oUl.style.display == "none";
            parentDom.append(oUl);
        }
        for(var i=0;i<data.length;i++){
            var oLi = document.createElement("li");
            var chk = "";
            var disabled = "";
            if(data[i].status == 1){ 
                chk = "checked";
            }
            if(data[i].relaStatus == 1){
                //chk = "checked";
                disabled = "disabled"
            }
            //oLi.innerHTML = "<div class='hitarea expandable-hitarea'></div>";
            
            if(isNeedCheck){
                if(options.notAllInputId){//部分有checkbox
                    console.log(data[i][options.notAllInputId])
                    if(data[i][options.notAllInputId] == 0){//需要input
                        oLi.innerHTML += "<input type='checkbox' "+chk+ " " + disabled +">";
                    }else{//不需要input

                    }
                }else{
                    oLi.innerHTML += "<input type='checkbox' "+chk+ " " + disabled +">";
                }
            }
            var str = "";
            // if(showName){
            //     str += "<a href='javascript:;' class='cloneTreeA ";  
            //     if(id == data[i].id && className != undefined && id != undefined){
            //         str += className
            //     }
            //     str += "'>";
            //     str += data[i][showName];
            //     str += +"</a>";
            //     oLi.innerHTML += str;
            // }else{
            //     if(data[i]["roleTitle"]){
            //         oLi.innerHTML += "<a href='javascript:;' class='cloneTreeA'>"+data[i][["roleTitle"]]+"</a>";
            //     }else{
            //         oLi.innerHTML += "<a href='javascript:;' class='cloneTreeA'>"+data[i][["roleGroupTitle"]]+"</a>";
            //     }
            // }

            if(showName instanceof Array){

                str += "<a href='javascript:;' class='cloneTreeA ";  
                if(id == data[i].id && className != undefined && id != undefined){
                    str += className
                }
                str += "'>";
                for(var n=0;n<showName.length;n++){
                    if(data[i][showName[n]]){
                        str += data[i][showName[n]];
                    }
                };
                str += "</a>";
                oLi.innerHTML += str;
            }





            oLi.data = data[i];
            if(data[i].id)oLi.setAttribute("_id",data[i].id);
            //oLi.options = options;
            if(data[i].lev == 1){
                $("#" +id+ "#navigation").append(oLi);
            }else{
                $(oUl).append(oLi)
            }

            var dom = $(oUl).find("li").eq($(oUl).find("li").length-1).find("a");
            //dom.on("click",options.clickFunc ? options.clickFunc : function(){})
            $(oUl).on("click",dom,options.clickFunc ? options.clickFunc : function(){})
            // if(globalFunctionId == ""){
            //     $("#root").click()
            // }else if(globalFunctionId == data[i].functionId){
            //     dom.click();
            // }
            
            if(data[i].children){
                this.loopLoad({
                    "data":data[i].children, 
                    "parentDom":$(oLi), 
                    "isNeedCheck":isNeedCheck, 
                    "notAllInputId":options.notAllInputId,
                    "parentId":$(oLi).attr("id"),
                    "showName":showName,
                    "id":id,
                    "className":className
                });

            }
        }

        $("#"+parentId).treeview();
    }
}
treeCheck.prototype.treeBindClick = function(options){
     $("#" + options.parentId +" a").click(function(){

        var parentData = $(this).parent("li")[0].data;

        $("#looptree a").css({"color":"#4A90E2"});
        $(this).css({"color":"red"});

        if(parentData.functionId){//权限
            $("#editPermission").show();
            $("#detailRow")[0].data = parentData;
        }else{
            if(parentData.orRole){//角色。分类
                if(parentData.orRole == "角色"){//角色
                    $("#editRuleOrRules").show();
                    $("#deleteRuleOrRules").show();
                }else{//分类
                    $("#createNewRuleOrRules").show();
                    $("#editRuleOrRules").show();
                    $("#deleteRuleOrRules").show();
                }
                $("#detailRow")[0].data = parentData;
            }
        }
        setValue4Desc($(this).parent("li")[0].data, $("#detailRow")[0])
     })

}

