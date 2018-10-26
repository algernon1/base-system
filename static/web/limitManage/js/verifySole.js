
function soleFun(){
     this.ctrl=null; //自身对象

    this.init=soleFun$init;
    this.parse=soleFun$parse;
}
function soleFun$init(){
    var soleProCtrl=$("*[solePro]")
    for(var i=0;i<soleProCtrl.length;i++){

        this.ctrl=soleProCtrl[i]
        var objCtrl=new soleProFun();
        objCtrl.ctrl=this.ctrl;
        soleProFun.init()
    }
}
function soleProFun(){
    this.ctrl=null; //自身对象
    this.soleUrl=null; //调取的url
    this.vali=new clsValidateCtrl();
    this.jsonData=null; //传入的参数
    this.init=soleProFun$init;
    this.parse=soleProFun$parse;
}
function soleProFun$init(){
    this.parse();
}
function soleProFun$parse(){

}
function soleAjaxFun(data){
    var jsData=JSON.parse(data);
    if(jsData.retCode=="0000000"){
        if(jsData.rspBody==false){

        }
    }
}
$(document).ready(function () {
    var objSole=new soleFun();
    objSole.init();
    document.body.jsSole=objSole;
})