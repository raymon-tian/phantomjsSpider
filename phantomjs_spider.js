//休眠函数
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

//判断是否有下一页，有则进行渲染，
function hasNextPage(){
  var a = document.querySelectorAll('#d_list .pagebox .pagebox_pre a')[1];
  if(a!=null){
    a.click();
    return true;
  }else{
    return false;
  }
}

//判断第一页是否有下一页，有则进行渲染，
function hasNextPageForFirstPage(){
  var a = document.querySelector('#d_list .pagebox .pagebox_pre a');
  if(a!=null){
    a.click();
    return true;
  }else{
    return false;
  }
}

//获取单个页面的所有news
function getAllNewsForSinglePage(){
  var items = new Array();
  var elements = document.querySelectorAll('#d_list ul li .c_time');
  var sum = elements.length;
  for(var i=0;i<sum;++i){
      items[i] = '';
      items[i] += elements[i].innerText; 
  }
  return items;
}
//显示单个页面的所有news
function showForSinglePage(items){
    var item = 0;
    for(item in items){
      console.log(items[item]+'\n');
    }
}

//递归获取数据
function getData(flag){
  if(flag == false){
    phantom.exit();
    return;
  }
  //获取数据，更新状态
  window.setTimeout(function(){
    var itemsNext = new Array();
    var flagNext;
    itemsNext = page.evaluate(getAllNewsForSinglePage);
    ++count;
    showForSinglePage(itemsNext);
    page.render("n"+count+".png");
    flagNext = page.evaluate(hasNextPage);
    console.log("-------------------------------------"+count+"\n");
    console.log("-------------------------------------"+flagNext+"\n");
    getData(flagNext);
  },4000);
}
//处理不同的状态
function handleStatus(status){
  console.log("Status: "+status);
  if(status!=="success"){
    console.log("Fail to load the address");
    phantom.exit();
  }else{
    console.log("Load the address successfully");
    var items = new Array();
    items = page.evaluate(getAllNewsForSinglePage);
    showForSinglePage(items);
    page.render("n"+count+".png");
    flag = page.evaluate(hasNextPageForFirstPage);
    console.log("-------------------------------------"+count+"\n");
    console.log("-------------------------------------"+flag+"\n");
    getData(flag);
  }
}
    
var page = require('webpage').create();
//是否有下一页
var flag;
//当前页数
var count = 1;

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onResourceReceived = function(response) {
  //console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
  //console.log('response.url---------'+response.url+"\n");
};

page.open('http://roll.news.sina.com.cn/',handleStatus);

