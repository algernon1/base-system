$(function(){
    var jsDel=new delFun();
    jsDel.init();
    document.body.jsDel=jsDel;
})
function delFun() {
    this.init=del$init;
    this.delBtn=del$delBtn;
}
function del$init(){

}
//树的删除 如果有底层的话就返回false
function del$delBtn(data,children){
    if(data[children].length){
        return false;
    }else{
       return true;
    }
}