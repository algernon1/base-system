var configFileJson = {
	"org":{//组织配置
		"isShow":true,
		"company":{//公司配置项
			"isShow":true,
			"text":"公司",
			"proOrgType":1
		},
		"purchaseOrg":{//采购组织配置项
			"isShow":true,//是否显示采购组织，false不显示，true显示,下同
			"text":"采购组织",//下拉显示的内容，下同
			"proOrgType":2
		}
	},
	"role":{//角色配置

		"isShow":true,
		"ExecutiveBuyer":{//执行采购员配置项
			"isShow":true,
			"text":"执行采购员",
			"proRoleType":1
		},
		"searchSourceBuyer":{//寻源采购员配置
			"isShow":true,
			"text":"寻源采购员",
			"proRoleType":2
		}
	},


	"rule":{//是否需要唯一性校验
		"isNeedCheck":true
	}
}