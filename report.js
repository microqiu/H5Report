/**
 * Created with WebStorm.
 * User: xiaoqiu
 * Email: lupengfei@gozap.com
 * Date: 15/2/5
 * Time: 下午12:07
 * Description:
 */




if(typeof jQuery == 'undefined')  throw 'jquery is not defined';


function strRepeat(times,str){
    var ret = '';
    for(var i = 0; i < times; i++){
        ret+=str;
    }
    return ret;
}

function mostClose(num){
    if(num > ~~('5' + strRepeat(num.toString().length - 1,'0'))){
        return ~~('1' + strRepeat(num.toString().length,'0'));
    }
    return ~~('5' + strRepeat(num.toString().length - 1,'0'));
}



Array.prototype.max = function(){
    var max = null;
    this.forEach(function(item,i){
        if(i == 0)
            max = item;
        else if(max < item)
            max = item;
    });
    return max;
};

Array.prototype.min = function(){
    var max = null;
    this.forEach(function(item,i){
        if(i == 0)
            max = item;
        else if (max > item)
            max = item;
    });
    return max;
};



jQuery.fn.report = function(option){
    var self = this;
    self.option = option;
    var ctx = this.get(0).getContext("2d");
    this.update = setInterval(function(){
        self.css('position','absolute').css('left','10px').css('top','10px');
        if(self.option.keys == null) throw 'key must not null';
        if(self.option.keys.constructor.name != 'Array') throw 'key must array';
        var keys = self.option.keys;
        var title = self.option.title ? self.option.title : 0;
        if(self.option.values == null) throw 'key must not null';
        if(self.option.values.constructor.name != 'Array') throw 'key must array';
        var values = self.option.values;

        var height = document.documentElement.clientHeight - 20;
        var width = document.documentElement.clientWidth - 20;
        self.attr('height',height).attr('width',width);

        //调试可删除
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(0,0,width,height);

        //core code

        //横向分割次数
        var hCutTimes = keys.length + 3;
        var hWidth = width / hCutTimes;
        //纵向分割次数
        var vCutTimes = keys.length + 4;
        var vHeight = height / vCutTimes;
        var cha = values.max() - values.min();
        cha = Math.floor(cha / keys.length);
        cha = mostClose(cha);
        var start = 0;
        if(values.min() - cha >0){
            start = Math.floor(values.min() / cha) * cha;
        }
        var leftArray = [];
        for(var i = 0; i < (keys.length + 2); i++){
            leftArray.push(start + i * cha);
        }

        var color = ['#003472','#003472','#177CB0','#1685AA','#46CDF3','#3EEDE7','#79F4FE','#AEF7FE'];


        // 设置字体
        ctx.font = "Bold 30px Arial";
        // 设置对齐方式

        //画左侧文字
        ctx.textAlign = "left";
        ctx.fillStyle = '#AEF7FE';
        ctx.fillText(title, hWidth ,vHeight);
        ctx.textAlign = "right";
        for(var i = 0; i < vCutTimes - 3; i++){
            // 设置填充颜色
            ctx.fillStyle =  color[i] ?  color[i] : '#AEF7FE';
            // 设置字体内容，以及在画布上的位置
            ctx.fillText(leftArray[i], hWidth ,height - (i+2) * vHeight);
            ctx.beginPath(); // 开始路径绘制
            ctx.moveTo(hWidth * 1.5, height - (i+2) * vHeight); // 设置路径起点，坐标为(20,20)
            ctx.lineTo(width - hWidth, height - (i+2) * vHeight); // 绘制一条到(200,20)的直线
            ctx.lineWidth = 2.0; // 设置线宽
            ctx.strokeStyle = "rgb(23,21,27)"; // 设置线的颜色
            ctx.stroke(); // 进行线的着色，这时整条线才变得可见
        }

        //画下方文字
        ctx.fillStyle = 'rgb(176,249,252)';
        ctx.textAlign = 'center';
        for(var i = 0; i < keys.length; i++){
            ctx.fillText(keys[i], hWidth * (i+2) ,height - vHeight);
        }
        //画折线
        var startX = 0;
        var startY = 0;
        var circle = [];
        for(var i = 0; i < values.length; i++){
            for(var n = 0; n < leftArray.length; n++){
                if(values[i] == leftArray[n] || (values[i] > leftArray[n] && values[i] <= leftArray[n + 1])){
                    circle.push({x:(i + 2) * hWidth,y:height - (n * vHeight - vHeight * ((leftArray[n] - values[i]) / cha)) - 2 * vHeight,color:color[n]});
                    if(i != 0){
                        ctx.lineWidth = 5.0;
                        ctx.strokeStyle = color[n];
                        ctx.beginPath();
                        ctx.moveTo(startX,startY);
                        ctx.lineTo((i + 2) * hWidth, height - (n * vHeight - vHeight * ((leftArray[n] - values[i]) / cha)) - 2 * vHeight); // 设置路径起点，坐标为(20,20)
                        startX = (i + 2) * hWidth;
                        startY = height - (n * vHeight - vHeight * ((leftArray[n] - values[i]) / cha)) - 2 * vHeight;
                        ctx.stroke();
                    }else{
                        startX = (i + 2) * hWidth;
                        startY = height - (n * vHeight - vHeight * ((leftArray[n] - values[i]) / cha)) - 2 * vHeight;
                    }
                    ctx.textAlign = 'center';
                    ctx.fillStyle = color[n];
                    // 设置字体内容，以及在画布上的位置
                    ctx.fillText(values[i], startX ,startY - 30);

                    break;
                }
            }
        }
        //解决圆中多出线的问题
        circle.forEach(function(item){
            ctx.beginPath();
            ctx.arc(item.x,item.y, 10, 0, Math.PI*2, true);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(item.x, item.y, 10, 0, Math.PI*2, true);
            ctx.lineWidth = 5.0;
            ctx.strokeStyle = item.color;
            ctx.stroke();
        });
        //var vCutTimes = values.min()
    },1000);

    this.setOption = function(option){
        this.option = option;
    };
    return this;
};