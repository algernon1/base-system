var titleJson = {
    "purchaser":{
        /******************************************************************************
         * 采购端
         ***************************************************************************/
        "login":{//用户登陆模块
            "login.html":"登陆",
            "register.html":"注册",
            "forgetPassword.html":"忘记密码-确认账号",
            "forgetEdit.html":"忘记密码-选择方式修改密码",
            "passwordNew.html":"忘记密码-重置密码"
        },
        "supplierManage":{
            "myRecommend.html":"我的自荐",
            "informationChange.html":"供应商信息变更"
        }
    },
    "operater":{
        /******************************************************************************
         * 运营端
         ***************************************************************************/
        "demandmanagement":{//需求池
            "purchase_Management.html":"采购需求池",
            "create_Management.html":"采购需求创建"
        },
        "limitManage":{//权限管理
            "orgFrame.html":"组织管理",
            "roleManage.html":"角色管理",
            "resourceManage.html":"资源管理",
            "userManage.html":"用户管理"
        },
        "supplierManage":{//供应商管理
            "aptitudeEarly.html":"资质预警",
            "detailSearch.html":"详细信息查询",
            "enterSupplier.html":"入围供应商",
            "supplierClassify.html":"供应商分类",
            "supplierSearch.html":"供应商查询"
        }
    }
}

function titleEval(titleJson){//赋值每一个页面的title
    var urlText = document.location.href;
    var titleVar = {};
    if(urlText.indexOf("/purchaser/") != -1 && urlText.indexOf("/operater/") == -1){//采购端
        titleVar = titleJson.purchaser;
    }else if(urlText.indexOf("/purchaser/") == -1 && urlText.indexOf("/operater/") != -1){//运营端
        titleVar = titleJson.operater;
    }
    for(var key in titleVar){
        if(urlText.indexOf(key) != -1){
            var titleVarJson = titleVar[key];
            for(var key2 in titleVarJson){
                if(urlText.indexOf(key2) != -1) {
                   // $("title").eq(0).html(titleVarJson[key2]);ie8及一下不支持用这种方法给title赋值
                   document.title = titleVarJson[key2];

                }
            }
        }
    }
}

$(function(){
    titleEval(titleJson)
});