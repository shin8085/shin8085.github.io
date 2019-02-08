var map=document.getElementById("mineMap");
var num=9; //num*num 行高
var boomnum=7; //炸弹数量
//矩阵中0-num-1表示周围炸弹数量，num表示炸弹，num+1表示安全地带
var mapArray=new Array();
var flag=0; //旗子
var find=0;//已找到的炸弹数量

InitMap();
InitMapArray();

//初始化地图
function InitMap(){
    //炸弹数量
    var boom=document.getElementsByClassName("boom")[0];
    boom.innerHTML="炸弹:"+boomnum;
    //旗子
    flag=0;
    var flags=document.getElementsByClassName("flag")[0];
    flags.innerHTML="标志"+flag;
    var _map=document.getElementsByClassName("_map")[0];
    map.removeChild(_map);
    var _map=document.createElement("div");
    _map.classList.add("_map");
    map.appendChild(_map);
    for(var i=0;i<num;i++){
        for(var j=0;j<num;j++)
        {
            var div=document.createElement("div");
            _map.appendChild(div);
            div.classList.add("MapGrid");
            div.id=String(i)+"|"+String(j);
            div.setAttribute("onclick","OnClick(this)"); //点击事件
        }
        _map.append(document.createElement("br"));
    }
}
//点击地图
function OnClick(a){
    if(a.style.backgroundColor=="yellow")
        return;
    id=a.id.split("|");
    if(mapArray[id[0]][id[1]]==num){ //失败
        a.style.background="red";
        gameOver();
    }
    else
        DisplayNum(a);
}
//初始化地图数组
function InitMapArray(){
    find=0;
    for(var i=0;i<num;i++)
    mapArray[i]=new Array();
    map.style.width=String(num*32)+"px";
    for(var i=0;i<num;i++)
        for(var j=0;j<num;j++){
            mapArray[i][j]=0;
        }
    for(var i=0;i<boomnum;i++){
        var x=parseInt(Math.random()*num);
        var y=parseInt(Math.random()*num);
        if(mapArray[x][y]==0)
            mapArray[x][y]=num; //设为炸弹
        else
            i--;
    }
    for(var x=0;x<num;x++)
        for(var y=0;y<num;y++){
            if(mapArray[x][y]==num)
                continue;
            var count=0;
            for(var i=x-1;i<=x+1;i++)
                for(var j=y-1;j<=y+1;j++){
                    try{
                        if(mapArray[i][j]==num)
                            count++;
                    }catch{};
                }
            mapArray[x][y]=count;
    }
    console.log(mapArray)
}

function DisplayNum(a){
    id=a.id.split("|");
    var x=Number(id[0]);
    var y=Number(id[1]);
    if(mapArray[x][y]==0)
        FindZero(x,y);
    else if (mapArray[x][y]==num)
        a.style.background="red";
    else if (mapArray[x][y]==num+1)
        a.style.background="cyan";
    else
        a.innerHTML=mapArray[x][y];
}
//寻找周围值为0的点
function FindZero(x,y){
    if(mapArray[x][y]==0)
        mapArray[x][y]=num+1;
    else if(mapArray[x][y]>0&&mapArray[x][y]<num){
        var now=document.getElementById(String(x)+"|"+String(y));
        now.innerHTML=mapArray[x][y];
        return;
    }
    else
        return;
    var now=document.getElementById(String(x)+"|"+String(y));
    now.style.background="cyan";
    now.removeAttribute("onclick");
    try{
        FindZero(x-1,y);//向左走
    }catch{};
    try{
        FindZero(x,y-1);//向上走
    }catch{;};
    try{
        FindZero(x+1,y);//向右走
    }catch{};
    try{
        FindZero(x,y+1);//向下走
    }catch{};
}
//游戏结束
function gameOver(){
    for(var i=0;i<num;i++)
        for(var j=0;j<num;j++){
            var div=document.getElementById(String(i)+"|"+String(j));
            div.removeAttribute("onclick");
        }
    var lose=document.getElementsByClassName("lose")[0];
    lose.removeAttribute("hidden");
    var grid=document.getElementsByClassName("MapGrid");
    for(var i=0;i<grid.length;i++)
        DisplayNum(grid[i])
}

function resetGame(){
    InitMap();
    InitMapArray();
    var lose=document.getElementsByClassName("lose")[0];
    var win=document.getElementsByClassName("win")[0];
    lose.hidden="true";
    win.hidden="true";
}

function chooseLevel(This){
    if(This.value==1){
        num=9;
        boomnum=7;
    }
    else if(This.value==2){
        num=15;
        boomnum=12;
    }
    else{
        num=20;
        boomnum=18;
    }
    var lose=document.getElementsByClassName("lose")[0];
    var win=document.getElementsByClassName("win")[0];
    lose.hidden="true";
    win.hidden="true";
    InitMap();
    InitMapArray();
}

//禁止鼠标map地图内鼠标右键显示菜单
map.oncontextmenu = function(){return false}; 
map.onmouseup = function(e){     //在map里点击触发事件
    id=e.target.id.split("|");
    if(e.button===2){       //如果button=1（鼠标左键），button=2（鼠标右键），button=0（鼠标中间键） 
        if(e.target.style.backgroundColor=="yellow"){
            e.target.style.backgroundColor="aquamarine";
            flag--;
            if(mapArray[id[0]][id[1]]==num)
                find--;
        }
        else if(mapArray[id[0]][id[1]]!=num+1){
            flag++;
            e.target.style.backgroundColor="yellow";
            if(mapArray[id[0]][id[1]]==num){ //是炸弹
                find++;
            }
        }
    }
    var flags=document.getElementsByClassName("flag")[0];
    flags.innerHTML="标志"+flag;
 } 

 function Finish(){
    if(find==boomnum){ //找到了所有的炸弹
        var win=document.getElementsByClassName("win")[0];
        win.removeAttribute("hidden");
    }
    else{
        var lose=document.getElementsByClassName("lose")[0];
        lose.removeAttribute("hidden");
    }
 }