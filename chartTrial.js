//https://stackoverflow.com/questions/326679/choosing-an-attractive-linear-scale-for-a-graphs-y-axis
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var min;    //数据中的最大值
var max;    //数据中的最小值
var n; //数据个数
var N_tick = 5;//间隔个数

var result; //计算后结果
var value = [1223, 122, 893, 346, 457, 738, 324];//产量
var year = [2013, 2014, 2015, 2016, 2017, 2018, 2019];//年份
var originDataValue = []; //原始数据
var originDataYear = []; //原始数据
var filterMark = null;
var valueSum = 0;


//https://juejin.cn/post/7033761580214911007
function partition(arr1, arr2, low, high) {
    let pivot = parseFloat(arr1[low]);
    let pivot2 = arr2[low];

    while (low < high) {
        while (low < high && parseFloat(arr1[high]) > pivot) {
            --high;
        }
        arr1[low] = arr1[high];
        arr2[low] = arr2[high];

        while (low < high && parseFloat(arr1[low]) <= pivot) {
            ++low;
        }
        arr1[high] = arr1[low];
        arr2[high] = arr2[low];
    }

    arr1[low] = pivot;
    arr2[low] = pivot2;

    return low;
}

function quickSort(arr1, arr2, low, high) {
    if (low < high) {
        let pivot = partition(arr1, arr2, low, high);
        quickSort(arr1, arr2, low, pivot - 1);
        quickSort(arr1, arr2, pivot + 1, high);
    }
    return { value: arr1, year: arr2 };
}


//插入排序（升序）
function insertionSort_ascending(arr1, arr2) {
    for (let i = 1; i < arr1.length; i++) {
        let currentElement1 = parseFloat(arr1[i]);
        let currentElement2 = arr2[i];
        let j = i - 1;

        while (j >= 0 && parseFloat(arr1[j]) > currentElement1) {
            arr1[j + 1] = arr1[j]; // 将较大的元素后移
            arr2[j + 1] = arr2[j];
            j--;
        }

        arr1[j + 1] = currentElement1; // 将当前元素插入到正确的位置
        arr2[j + 1] = currentElement2;
    }

    return { Value: arr1, Year: arr2 };
}

//插入排序（降序）
function insertionSort_descending(arr1, arr2) {
    for (let i = 1; i < arr1.length; i++) {
        let currentElement1 = parseFloat(arr1[i]);
        let currentElement2 = arr2[i];
        let j = i - 1;

        while (j >= 0 && parseFloat(arr1[j]) < currentElement1) {
            arr1[j + 1] = arr1[j]; // 将较大的元素后移
            arr2[j + 1] = arr2[j];
            j--;
        }

        arr1[j + 1] = currentElement1; // 将当前元素插入到正确的位置
        arr2[j + 1] = currentElement2;
    }

    return { Value: arr1, Year: arr2 };
}

function min(num1, num2) {
    return num1 > num2 ? num1 : num2;
}

//“进位”
function get_round(x) {
    if (x <= 0.1)
        return 0.1;
    if (x <= 0.2)
        return 0.2;
    if (x <= 0.25)
        return 0.25;
    if (x <= 0.3)
        return 0.3;
    if (x <= 0.4)
        return 0.4;
    if (x <= 0.5)
        return 0.5;
    if (x <= 0.6)
        return 0.6;
    if (x <= 0.7)
        return 0.7;
    if (x <= 0.75)
        return 0.75;
    if (x <= 0.8)
        return 0.8;
    if (x <= 0.9)
        return 0.9;
    if (x <= 1.0)
        return 1.0;
}

//获取是几位数
function get_digits(x) {
    var digit = 0;
    while (Math.floor(x)) {
        digit++;
        x /= 10;
    }
    //console.log(digit);
    return digit;

}

//计算y轴
//https://stackoverflow.com/questions/326679/choosing-an-attractive-linear-scale-for-a-graphs-y-axis
function count() {

    n = value.length;
    max = Math.max.apply(null, value);
    min = Math.min.apply(null, value);
    //console.log("min: ", min, " max: ", max);

    var range = max - min;
    var tick_range = range / N_tick;
    //console.log(tick_range);

    var digit = get_digits(tick_range);
    var temp = (tick_range / Math.pow(10, digit)).toFixed(3);
    var temp2 = get_round(temp);
    var new_tick_range = temp2 * Math.pow(10, digit);

    //console.log(tick_range, "=>", new_tick_range);
    var new_lower = new_tick_range * Math.floor(min / new_tick_range);
    //var new_upper = new_tick_range * Math.floor(1 + (max / new_tick_range));

    var new_upper = new_lower;
    //补多一个间隔以便折线图的美观
    for (var k = 0; k < N_tick + 1; k++) {
        new_upper += new_tick_range;

        if (new_upper >= max) {
            N_tick = k + 1;
            break;
        }
    }

    console.log("lower: ", new_lower.toFixed(2), " upper: ", new_upper.toFixed(2), " tick: ", new_tick_range.toFixed(2));

    result = [new_lower.toFixed(2), new_upper.toFixed(2), new_tick_range.toFixed(2), N_tick];
    console.log(result);
    return result;
}

function count2() {

    n = value.length;   //数组长度
    var maxValue = Math.max.apply(null, value); //产量中的最大值
    var minValue = Math.min.apply(null, value); //产量中的最小值
    var originProduct = 0; //坐标原点的产量
    var tickRange = 100;

    // 检验最大值和最小值是否差距太小
    var diffPercentage = (maxValue - minValue) / maxValue;
    var transformedMaxValue;      // y 轴原点变换后，最大值新坐标的位置在旧坐标的位置

    // 若达到触发条件，动态改变原点值
    if (0 < diffPercentage && diffPercentage <= 0.6) {
        var x = (0.6 * minValue - 1) / 0.6;
        var newOriginValue = Math.floor(x);
        originProduct = newOriginValue;
        transformedMaxValue = maxValue - newOriginValue;
    }

    // 否则，原点值默认为0
    else {
        originProduct = 0;
        transformedMaxValue = maxValue;
    }

    // 计算 y 轴刻度的增长值
    var divFlo = transformedMaxValue / N_tick;
    var divInt = Math.floor(divFlo);
    var diff = divFlo - divInt;
    // ====================
    if (diff == 0) {
        tickRange = divInt;
    }
    else if (diff <= 0.5) {
        tickRange = divInt + 0.5;
    }
    else {
        tickRange = divInt + 1;
    }

    var tempMax = (tickRange * (N_tick)) + originProduct;
    result = [originProduct, tempMax, tickRange, N_tick];

    return result;
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

//原点坐标
var originPoint = {
    x: 0,
    y: 0
};

//y轴端点坐标（“产量”万吨）
var yAxisEndPoint = {
    x: 0,
    y: 0
};

//x轴端点坐标（年份）
var xAxisEndPoint = {
    x: 0,
    y: 0
};


//关于y轴
var tickRangeHeight = 50;   //Y轴间隔的高度（不是值）
var yMarginTop = 150;       //Y轴（箭头端）与顶部的距离
var yMarginLeft = 100;      //Y轴（轴线）与画布左边的距离

//关于x轴
var dataMarginLeft = 20;
var dataMarginRight = 20;
var dataWidth = 50;

//关于柱状图
var maxDataHeight; //原点至y轴最大刻度的距离
var histogramTransparencyValue = 1;
var histogramGradientDirection = 0;
var histogramDimension = 3;

//关于全局
var defaultFontStyle = "20px serif";
var first = true;
var defaultCanvasWidth = 1000;
var defaultCanvasHeight = 568;
var zoomValue = 1;

//排序方式：0默认，1升序，2降序
var order = {
    year: 0,    //按年排序
    value: 0    //按产量排序
};

//图是否被隐藏
var hide = {
    histogram: false,   //柱状图
    line: false         //折线图
};


//保存柱状图之前的样式
var style_before = {
    solid: null,
    color1: "rgb(250, 184, 255)", //粉色
    color2: "rgb(77, 163, 255)", //蓝色
    direction: 0,
    pattern: null,
    transparency: 1,
    dimension: 3,
};

//折线图样式
var line_chart_style = {
    hide: false,
    lineColor: "black",
    lineShape: "solid",
    lineWidth: 2,
    dotColor: "black",
    dotShape: "arc",
    dotSize: 5,
    fontFamily: "宋体",
    fontColor: "black",
    fontSize: "20px",
}

//数据筛选与过滤
var dataFilterType = {
    default: true,
    aboveAverage: false,
    belowAverage: false,
}

function firstInitial() {
    originDataValue = JSON.parse(localStorage.getItem('value'));
    originDataYear = JSON.parse(localStorage.getItem('year'));

    value = originDataValue;
    year = originDataYear;

    n = value.length;

    for (var i = 0; i < value.length; i++)
        valueSum += parseFloat(value[i]);

    //先计算
    count2();
}

//初始化
function initial() {


    var originValue = result[0];
    var tickRange = result[2]; // 刻度线的高度
    var numIntervals = result[3]; // 刻度线数量

    //y轴
    var yAxisStart = tickRangeHeight * (numIntervals + 1) + yMarginTop;// * zoomValue; // y轴起点的y坐标
    var yAxisEnd = yAxisStart - tickRangeHeight * (numIntervals + 2);// y轴终点的y坐标

    originPoint.x = yMarginLeft;
    originPoint.y = yAxisStart;

    yAxisEndPoint.x = originPoint.x;
    yAxisEndPoint.y = yAxisEnd;

    //x轴
    var xAxisStart = originPoint.x; // y轴起点的y坐标
    var xAxisEnd = originPoint.x + (dataWidth * value.length) + (dataMarginLeft * value.length) + (dataMarginRight * value.length);// y轴终点的y坐标

    //如果被筛选后没有可显示的数据，也要保证x轴有一定长度
    if (xAxisEnd == originPoint.x || (xAxisEnd) < 250)
        xAxisEnd = 250;

    xAxisEndPoint.x = xAxisEnd;
    xAxisEndPoint.y = originPoint.y;

    //数据
    maxDataHeight = numIntervals * tickRangeHeight;

    //缩放画布

    //重定位x轴与调整宽度
    canvas.width = xAxisEndPoint.x;

    if (zoomValue) {

        //重定位
        if (originPoint.x < yMarginLeft * zoomValue) {
            var xAxisOffset = yMarginLeft * zoomValue - originPoint.x;
            originPoint.x += xAxisOffset;
            xAxisEndPoint.x += xAxisOffset;
        }

        //画布宽度调整
        if (canvas.width - xAxisEndPoint.x < 120 * zoomValue) {
            canvas.width = xAxisEndPoint.x + (120 * zoomValue);
        }

    }


    //重定位y轴与调整高度
    if (zoomValue != 1) {

        //重定位
        if (yAxisEndPoint.y < yMarginTop * zoomValue) {
            var yAxisOffset = yMarginTop - yAxisEndPoint.y;
            originPoint.y += yAxisOffset;
            yAxisEndPoint.y += yAxisOffset;
        }

        //画布高度调整
        if (canvas.height - yAxisEndPoint.y < 100 * zoomValue) {
            canvas.height = yAxisEndPoint.y + (100 * zoomValue);
        }
    }

    canvas.height = originPoint.y + 100;


    //可能需要添加滑动条
    resize();
}


function resize() {

    var canvasContainer = document.getElementById('canvasContainer');
    var newCanvasContainerStyle;

    //超出了默认宽度，添加滑动条

    //宽度超出 左右滑动条
    if (canvas.width > defaultCanvasWidth && canvas.height <= defaultCanvasHeight)
        newCanvasContainerStyle = "width: 1000px; height: 568px; overflow-x: scroll;";


    //高度超出 上下滑动条
    else if (canvas.width <= defaultCanvasWidth && canvas.height > defaultCanvasHeight)
        newCanvasContainerStyle = `width: ${canvas.width}px; height: 568px; overflow-y: scroll;`;


    //宽度与高度都超出 上下左右滑动条
    else if (canvas.width > defaultCanvasWidth && canvas.height > defaultCanvasHeight)
        newCanvasContainerStyle = "width: 1000px; height: 568px; overflow-x: scroll; overflow-y: scroll;";


    //没超出 不用滑动条
    else
        newCanvasContainerStyle = "width: 1000px; height: 568px;";


    canvasContainer.setAttribute("style", newCanvasContainerStyle);

}

function relocate() {

}

//清空画布
function clearBoard() {
    canvas.height = canvas.height;
    canvas.width = canvas.width;
}

//绘制y轴
function paint_y_axis() {

    // 绘制刻度线和刻度值
    var numIntervals = result[3]; // 刻度线数量
    var tickRange = result[2]; // 刻度线的高度

    //坐标轴样式
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    //y轴轴线
    ctx.beginPath();
    ctx.moveTo(originPoint.x, originPoint.y);
    ctx.lineTo(originPoint.x, yAxisEndPoint.y);
    ctx.stroke();

    //箭头
    ctx.beginPath();
    ctx.moveTo(originPoint.x - 5, yAxisEndPoint.y + 5);
    ctx.lineTo(originPoint.x, yAxisEndPoint.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originPoint.x + 5, yAxisEndPoint.y + 5);
    ctx.lineTo(originPoint.x, yAxisEndPoint.y);
    ctx.stroke();

    //y轴标签
    ctx.font = defaultFontStyle;
    ctx.textAlign = "left";
    ctx.fillText("产量（万吨）", originPoint.x - 50, yAxisEndPoint.y - 25);

    //y轴刻度值与刻度坐标
    var yVal = result[0];
    var yPos = originPoint.y;

    //绘制y轴刻度 （产量）
    for (var i = 0; i <= numIntervals + 1; i++) {

        var y = (parseFloat(yVal)).toFixed(2);

        // 绘制刻度线
        ctx.beginPath();
        ctx.moveTo(originPoint.x - 5, yPos);
        ctx.lineTo(originPoint.x, yPos);
        ctx.stroke();

        // 绘制刻度值
        ctx.font = defaultFontStyle;
        ctx.textAlign = 'right';
        ctx.fillText(y.toString(), originPoint.x - 10, yPos);

        yVal = parseFloat(y) + parseFloat(tickRange);
        yPos -= tickRangeHeight;//50
    }


}

//绘制x轴
function paint_x_axis() {

    ctx.fillStyle = 'black';

    //x轴线
    ctx.beginPath();
    ctx.moveTo(originPoint.x, originPoint.y);
    ctx.lineTo(xAxisEndPoint.x, originPoint.y);
    ctx.stroke();

    //箭头
    ctx.beginPath();
    ctx.moveTo(xAxisEndPoint.x - 5, originPoint.y - 5);
    ctx.lineTo(xAxisEndPoint.x, originPoint.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xAxisEndPoint.x - 5, originPoint.y + 5);
    ctx.lineTo(xAxisEndPoint.x, originPoint.y);
    ctx.stroke();

    //x轴标签
    ctx.font = defaultFontStyle;
    ctx.textAlign = "left";
    ctx.fillText("年份", xAxisEndPoint.x + 10, originPoint.y);

    var coor_x = originPoint.x;

    //绘制x轴刻度（年份）
    for (var i = 0; i < value.length; i++) {

        //左边距
        coor_x += dataMarginLeft;

        //绘制年份
        ctx.textAlign = "center";
        ctx.fillStyle = "black"
        ctx.font = defaultFontStyle;
        ctx.fillText(year[i].toString(), coor_x + dataWidth / 2, originPoint.y + 20);

        //右边距
        coor_x += (dataWidth + dataMarginRight);
    }

}

var topHeight = 10;

//绘制柱状图
function paint_histogram(solid, gradient, pattern, before, shadow, show_num_label) {

    var coor_x = originPoint.x;
    var coor_y = originPoint.y;
    var paintTransparency = 1;
    var dim = 3;

    for (var i = 0; i < value.length; i++) {

        if (i != 0)
            ctx.restore();

        //计算矩形高度
        var dataHeight = (parseFloat(value[i]) - result[0]) * (maxDataHeight / (result[1] - result[0]));
        coor_x += dataMarginLeft;

        //https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes

        ctx.globalAlpha = histogramTransparencyValue;
        dim = histogramDimension;

        //单色
        if (solid != null) {
            ctx.fillStyle = solid;
        }

        //渐变色
        else if (gradient != null) {

            var grd;

            //上至下
            if (histogramGradientDirection == 0)
                grd = ctx.createLinearGradient(coor_x, coor_y - dataHeight, coor_x, coor_y);

            //下之上
            if (histogramGradientDirection == 1)
                grd = ctx.createLinearGradient(coor_x, coor_y, coor_x, coor_y - dataHeight);

            //左至右
            if (histogramGradientDirection == 2)
                grd = ctx.createLinearGradient(coor_x, coor_y, coor_x + dataWidth, coor_y);

            //右至左
            if (histogramGradientDirection == 3)
                grd = ctx.createLinearGradient(coor_x + dataWidth, coor_y, coor_x, coor_y);

            //左下至右上↗
            if (histogramGradientDirection == 4)
                grd = ctx.createLinearGradient(coor_x, coor_y, coor_x + dataWidth, coor_y - dataHeight / 9);


            //右上至左下↙
            if (histogramGradientDirection == 5)
                grd = ctx.createLinearGradient(coor_x + dataWidth, coor_y - dataHeight / 9, coor_x, coor_y);

            //右下至左上↖
            if (histogramGradientDirection == 6)
                grd = ctx.createLinearGradient(coor_x + dataWidth, coor_y, coor_x, coor_y - dataHeight / 9);

            //左上至右下↘
            if (histogramGradientDirection == 7)
                grd = ctx.createLinearGradient(coor_x, coor_y - dataHeight / 9, coor_x + dataWidth, coor_y,);

            grd.addColorStop(0, gradient.color1);
            grd.addColorStop(1, gradient.color2);
            ctx.fillStyle = grd;
        }

        //纹理样式
        else if (pattern != null) {

            //图片在点击"设置"之后就加载好了
            var img = new Image();
            img.src = pattern.img;
            var ptrn = ctx.createPattern(img, pattern.repetition);
            ctx.fillStyle = ptrn;

            style_before.pattern = pattern;
            style_before.solid = style_before.color1 = style_before.color2 = null;
            style_before.transparency = histogramTransparencyValue;
        }

        //恢复之前的样式
        else if (before != null) {


            dim = style_before.dimension;

            if (hide.histogram == true)
                ctx.globalAlpha = style_before.transparency;
            else
                ctx.globalAlpha = histogramTransparencyValue;

            //单色
            if (style_before.solid != null) {
                ctx.fillStyle = style_before.solid;
            }

            //渐变色
            else if (style_before.color1 != null) {

                var grd;

                //上至下
                if (style_before.direction == 0)
                    grd = ctx.createLinearGradient(coor_x, coor_y - dataHeight, coor_x, coor_y);

                //下之上
                if (style_before.direction == 1)
                    grd = ctx.createLinearGradient(coor_x, coor_y, coor_x, coor_y - dataHeight);

                //左至右
                if (style_before.direction == 2)
                    grd = ctx.createLinearGradient(coor_x, coor_y, coor_x + dataWidth, coor_y);

                //右至左
                if (style_before.direction == 3)
                    grd = ctx.createLinearGradient(coor_x + dataWidth, coor_y, coor_x, coor_y);

                //左下至右上↗
                if (style_before.direction == 4)
                    grd = ctx.createLinearGradient(coor_x, coor_y, coor_x + dataWidth, coor_y - dataHeight / 9);

                //右上至左下↙
                if (style_before.direction == 5)
                    grd = ctx.createLinearGradient(coor_x + dataWidth, coor_y - dataHeight / 9, coor_x, coor_y);

                //右下至左上↖
                if (style_before.direction == 6)
                    grd = ctx.createLinearGradient(coor_x + dataWidth, coor_y, coor_x, coor_y - dataHeight / 9);

                //左上至右下↘
                if (style_before.direction == 7)
                    grd = ctx.createLinearGradient(coor_x, coor_y - dataHeight / 9, coor_x + dataWidth, coor_y,);

                //圆形渐变
                grd.addColorStop(0, style_before.color1);
                grd.addColorStop(1, style_before.color2);
                ctx.fillStyle = grd;
            }

            //纹理样式
            else if (style_before.pattern != null) {
                var img = new Image();
                img.src = style_before.pattern.img;
                var ptrn = ctx.createPattern(img, style_before.pattern.repetition);
                ctx.fillStyle = ptrn;
            }
        }

        //默认
        else {
            dim = 3;
            var grd = ctx.createLinearGradient(coor_x + dataWidth / 2, coor_y, coor_x + dataWidth / 2, coor_y - dataHeight);
            grd.addColorStop(0, "rgb(77, 163, 255)");
            grd.addColorStop(1, "rgb(250, 184, 255)");
            ctx.fillStyle = grd;
            ctx.globalAlpha = 1;

            style_before.solid = null;
            style_before.color1 = "rgb(77, 163, 255)";
            style_before.color2 = "rgb(250, 184, 255)";
            style_before.transparency = 1;
            style_before.dimension = 2;
        }

        //设置阴影
        if (shadow) {

            //尝试立体效果
            if (dim == 3) {
                var oldGlobalAlpha = ctx.globalAlpha;

                if (dataHeight > 10) {
                    //中间
                    ctx.globalAlpha = oldGlobalAlpha + 0.1
                    ctx.shadowOffsetX = 4;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

                    ctx.beginPath();
                    ctx.moveTo(coor_x + dataWidth / 5, coor_y);
                    var tempCoorY = (coor_y - dataHeight + topHeight > originPoint.y) ? originPoint.y : coor_y - dataHeight + topHeight;
                    ctx.lineTo(coor_x + dataWidth / 5, tempCoorY);
                    ctx.lineTo(coor_x + dataWidth, tempCoorY);
                    ctx.lineTo(coor_x + dataWidth, coor_y);
                    ctx.lineTo(coor_x, coor_y);
                    ctx.fill();
                    ctx.globalAlpha = 1;


                    //左边
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                    ctx.globalAlpha = oldGlobalAlpha + 0.3;

                    ctx.beginPath();
                    ctx.moveTo(coor_x, coor_y);
                    ctx.lineTo(coor_x, coor_y - dataHeight);
                    ctx.lineTo(coor_x + dataWidth / 5, coor_y - dataHeight + topHeight);
                    ctx.lineTo(coor_x + dataWidth / 5, coor_y);
                    ctx.lineTo(coor_x, coor_y);
                    ctx.fill();

                    //上面
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                    ctx.globalAlpha = oldGlobalAlpha + 0.2;
                    ctx.beginPath();
                    ctx.moveTo(coor_x, coor_y - dataHeight);
                    ctx.lineTo(coor_x + dataWidth - dataWidth / 5, coor_y - dataHeight);

                    ctx.lineTo(coor_x + dataWidth, tempCoorY);
                    ctx.lineTo(coor_x + dataWidth / 5, tempCoorY);
                    ctx.fill();

                }

                //只画上面与旁边（三角形）
                else {

                    //左边
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                    ctx.globalAlpha = oldGlobalAlpha + 0.3;

                    ctx.beginPath();
                    ctx.moveTo(coor_x, coor_y);
                    ctx.lineTo(coor_x, coor_y - dataHeight);
                    ctx.lineTo(coor_x + dataWidth / 5, coor_y);
                    ctx.lineTo(coor_x, coor_y);
                    ctx.fill();

                    //上面
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                    ctx.globalAlpha = oldGlobalAlpha + 0.2;
                    ctx.beginPath();
                    ctx.moveTo(coor_x, coor_y - dataHeight);
                    ctx.lineTo(coor_x + dataWidth - dataWidth / 5, coor_y - dataHeight);
                    ctx.lineTo(coor_x + dataWidth, coor_y);
                    ctx.lineTo(coor_x + dataWidth / 5, coor_y);
                    ctx.fill();
                }

                ctx.globalAlpha = oldGlobalAlpha;

                //恢复阴影设置参数
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                ctx.shadowColor = null;
                ctx.globalAlpha = 1;
            }

            //设置阴影参数
            if (dim == 2) {
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 2;
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

                //绘制柱状图
                ctx.beginPath();
                ctx.moveTo(coor_x, coor_y);
                ctx.lineTo(coor_x, coor_y - dataHeight);
                ctx.lineTo(coor_x + dataWidth, coor_y - dataHeight);
                ctx.lineTo(coor_x + dataWidth, coor_y);
                ctx.lineTo(coor_x, coor_y);
                ctx.fill();
                ctx.globalAlpha = 1;

                //恢复阴影设置参数
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                ctx.shadowColor = null;
            }
        }

        else {
            //绘制矩形
            ctx.beginPath();
            ctx.moveTo(coor_x, coor_y);
            ctx.lineTo(coor_x, coor_y - dataHeight);
            ctx.lineTo(coor_x + dataWidth, coor_y - dataHeight);
            ctx.lineTo(coor_x + dataWidth, coor_y);
            ctx.lineTo(coor_x, coor_y);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = null;
            ctx.globalAlpha = 1;
        }

        //显示产量的数字
        if (show_num_label) {
            ctx.textAlign = "center";
            ctx.fillStyle = "black"
            ctx.font = defaultFontStyle;
            ctx.fillText(value[i].toString(), coor_x + dataWidth / 2, coor_y - dataHeight - (15 * zoomValue));
        }

        //递增
        coor_x += (dataWidth + dataMarginRight);
    }

    ctx.globalAlpha = 1;
}

//先选择样式再绘画的接口
async function histogram_style(_hide, solid, gradient, pattern, before) {

    //重绘背景
    await setBackground();
    ctx.fillStyle = "black";

    //重绘坐标轴
    paint_y_axis();
    paint_x_axis();

    //重绘折状图
    paint_line_chart();

    //单色
    if (solid != null) {

        solid = document.getElementById("solid_color").value;
        style_before.solid = solid;
        style_before.color1 = style_before.color2 = style_before.pattern = null;
        style_before.transparency = histogramTransparencyValue;
        style_before.dimension = histogramDimension;
    }

    //渐变色
    if (gradient != null) {

        var grd_color1 = document.getElementById("grd_color1").value;
        var grd_color2 = document.getElementById("grd_color2").value;
        gradient = { color1: grd_color1, color2: grd_color2 };

        style_before.solid = style_before.pattern = null;
        style_before.color1 = gradient.color1;
        style_before.color2 = gradient.color2;
        style_before.transparency = histogramTransparencyValue;
        style_before.direction = histogramGradientDirection;
        style_before.dimension = histogramDimension;
    }

    //图片纹理
    if (pattern != null) {
        //https://www.twle.cn/l/yufei/canvas/canvas-basic-pattern.html
        var img = new Image();
        img.src = pattern.img;

        //加载好了才绘柱状图
        img.onload = function () {
            if (hide.histogram == false)
                paint_histogram(null, null, pattern, null, true, true);
        };

        return;
    }

    //恢复之前的样式
    if (before != null && style_before.pattern != null) {
        var img = new Image();
        img.src = style_before.pattern.img;

        img.onload = function () {
            if (hide.histogram == false)
                paint_histogram(null, null, null, before, true, true);
        };

        return;
    }

    else {

        if (before != null && style_before.color1 != null)
            style_before.direction = histogramGradientDirection;

        if (hide.histogram == false)
            paint_histogram(solid, gradient, null, before, true, true);
    }
}

//隐藏柱状图
var hide_histogram = document.getElementById("hide_histogram");
hide_histogram.onclick = function () {
    //console.log(hide_histogram.checked);
    //if (!show.histogram)
    hide.histogram = hide_histogram.checked;
    histogram_style(hide_histogram.checked, null, null, null, style_before);
}

var dimensionOptions = document.getElementById("histrogram_dimension");
dimensionOptions.addEventListener("change", function () {

    if (dimensionOptions.value == "3D") {
        histogramDimension = 3;
        style_before.dimension = 3;
    }

    else if (dimensionOptions.value == "2D") {
        histogramDimension = 2;
        style_before.dimension = 2;
    }

    histogram_style(hide.histogram, null, null, null, true);
})

//柱状图颜色透明度
var histogramTransparency = document.getElementById("histogram_transparency");
histogramTransparency.addEventListener("change", function () {
    histogramTransparencyValue = histogramTransparency.value;
    histogram_style(hide.histogram, null, null, null, true);
})

//渐变颜色方向
var grdDirectionOptions = document.getElementById("gradient_direction");
grdDirectionOptions.addEventListener("change", function () {

    if (grdDirectionOptions.value == "up_down")
        histogramGradientDirection = 0;

    else if (grdDirectionOptions.value == "down_up")
        histogramGradientDirection = 1;

    else if (grdDirectionOptions.value == "left_right")
        histogramGradientDirection = 2;

    else if (grdDirectionOptions.value == "right_left")
        histogramGradientDirection = 3;

    else if (grdDirectionOptions.value == "bottomLeft_topRight")
        histogramGradientDirection = 4;

    else if (grdDirectionOptions.value == "topRight_bottomLeft")
        histogramGradientDirection = 5;

    else if (grdDirectionOptions.value == "bottomRight_topLeft")
        histogramGradientDirection = 6;

    else if (grdDirectionOptions.value == "topLeft_bottomRight")
        histogramGradientDirection = 7;

    if (style_before.color1 != null && style_before.color2 != null) {
        histogram_style(hide.histogram, null, null, null, true);
    }
})

/* 柱状图样式设置，只能选一个 */
//https://blog.csdn.net/m0_64074850/article/details/125894773
var checkbox_style = document.querySelectorAll(".histogramSetting input");
for (var i = 0; i < checkbox_style.length; i++) {

    if (checkbox_style[i].getAttribute("type") == "checkbox") {

        checkbox_style[i].addEventListener('click', function () {

            for (var j = 0; j < checkbox_style.length; j++) {

                if (checkbox_style[j].getAttribute("type") == "checkbox")
                    checkbox_style[j].checked = false;
            }

            this.checked = true;
        })
    }
}

//柱状图样式“设置”按钮被点击后
var submit_histogram_style = document.getElementById("submit_histogram_style");
submit_histogram_style.onclick = function () {

    var _hide = document.getElementById("hide_histogram").checked;
    var solid = document.getElementById("solid").checked;
    var gradient = document.getElementById("gradient").checked;
    var pattern = document.getElementById("pattern").checked;
    var _default = document.getElementById("default").checked;

    //solid单色
    if (solid) {
        console.log("单色");
        histogram_style(false, true, null, null, null);
    }

    //渐变色
    else if (gradient) {
        console.log("渐变");
        histogram_style(false, null, true, null, null);
    }

    //纹理
    else if (pattern) {
        var pattern_img = document.getElementById('pattern_img');
        var selectedPatternImg = pattern_img.files;
        if (selectedPatternImg.length == 1) {
            var patternStyle = {
                img: window.URL.createObjectURL(selectedPatternImg[0]),
                repetition: "repeat"
            };

            console.log("纹理");

            if (hide.histogram == true) {
                var img = new Image();
                img.src = patternStyle.img;
                img.onload = function () {
                    var ptrn = ctx.createPattern(img, patternStyle.repetition);
                    ctx.fillStyle = ptrn;

                    style_before.pattern = patternStyle;
                    style_before.solid = style_before.color1 = style_before.color2 = null;

                }
            }

            else {
                histogram_style(false, null, null, patternStyle, null);
            }

        }
        else {
            alert("您没有导入纹理样式！");
        }
    }

    //默认
    else if (_default) {
        var dimensionOptions = document.getElementById("histrogram_dimension");
        dimensionOptions.value = "3D";
        histogramDimension = 3;
        histogramTransparency.value = 1;
        histogramTransparencyValue = 1;
        histogram_style(false, null, null, null, null);
    }

    //无效设置
    else {
        alert("设置失败，您没有勾选其中一种！");
    }

}

//计算每个数据的占比%
function count_proportion() {
    var prop = [];
    var sum = 0;

    for (var i = 0; i < value.length; i++)
        sum += parseFloat(value[i]);

    for (var i = 0; i < value.length; i++) {
        prop.push((parseFloat(value[i] / sum) * 100).toFixed(2));
    }

    return prop;
}

// 隐藏折线图
document.getElementById("hide_line_chart").addEventListener("input", function () {
    line_chart_style.hide = document.getElementById("hide_line_chart").checked;
    mainFunc();
})

document.getElementById("line_color").addEventListener("input", function () {
    line_chart_style.lineColor = document.getElementById("line_color").value;
    mainFunc();
})

document.getElementById("line_shape").addEventListener("change", function () {
    line_chart_style.lineShape = document.getElementById("line_shape").value;
    mainFunc();
});

document.getElementById("line_width").addEventListener("input", function () {
    line_chart_style.lineWidth = document.getElementById("line_width").value;
    mainFunc();
})

document.getElementById("dot_color").addEventListener("input", function () {
    line_chart_style.dotColor = document.getElementById("dot_color").value;
    mainFunc();
})

document.getElementById("dot_shape").addEventListener("change", function () {
    line_chart_style.dotShape = document.getElementById("dot_shape").value;
    mainFunc();
});

document.getElementById("dot_size").addEventListener("input", function () {
    line_chart_style.dotSize = document.getElementById("dot_size").value;
    mainFunc();
});

document.getElementById("font_family").addEventListener("change", function () {
    line_chart_style.fontFamily = document.getElementById("font_family").value;
    mainFunc();
});

document.getElementById("font_color").addEventListener("input", function () {
    line_chart_style.fontColor = document.getElementById("font_color").value;
    mainFunc();
});

document.getElementById("font_size").addEventListener("input", function () {
    line_chart_style.fontSize = document.getElementById("font_size").value + "px";
    mainFunc();
});

//绘制折线图
function paint_line_chart() {

    if (line_chart_style.hide == true) {
        return;
    }

    var coor_x = originPoint.x;
    var coor = [];

    //先计算圆圈的坐标
    ctx.fillStyle = line_chart_style.dotColor;
    for (var i = 0; i < value.length; i++) {

        //计算矩形高度
        var dataHeight = (value[i] - result[0]) * (maxDataHeight / (result[1] - result[0]));
        coor_x += dataMarginLeft;

        coor.push({ x: coor_x + dataWidth / 2, y: originPoint.y - dataHeight - (40 * zoomValue) });

        //递增
        coor_x += (dataWidth + dataMarginRight);
    }

    // 绘制直线
    ctx.strokeStyle = line_chart_style.lineColor;
    if (line_chart_style.lineShape == "dashed") {
        ctx.setLineDash([4, 4]);
    }
    ctx.lineWidth = line_chart_style.lineWidth;
    for (var i = 0; i < coor.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(coor[i].x, coor[i].y);
        ctx.lineTo(coor[i + 1].x, coor[i + 1].y);
        ctx.stroke();
    }

    coor_x = originPoint.x;

    //绘制圆圈
    for (var i = 0; i < value.length; i++) {

        //计算矩形高度
        var dataHeight = (value[i] - result[0]) * (maxDataHeight / (result[1] - result[0]));
        coor_x += dataMarginLeft;

        ctx.beginPath();
        //http://caibaojian.com/html5-canvas-arc.html
        //https://blog.csdn.net/Jacgu/article/details/106378627
        if (line_chart_style.dotShape == "arc") {
            ctx.arc(coor_x + dataWidth / 2, originPoint.y - dataHeight - (40 * zoomValue), line_chart_style.dotSize, 0, 2 * Math.PI);
        } else {
            ctx.rect(coor_x + dataWidth / 2 - line_chart_style.dotSize / 2 * Math.sqrt(2),
                originPoint.y - dataHeight - (40 * zoomValue) - line_chart_style.dotSize / 2 * Math.sqrt(2),
                line_chart_style.dotSize * Math.sqrt(2),
                line_chart_style.dotSize * Math.sqrt(2));
        }
        ctx.fill();

        //递增
        coor_x += (dataWidth + dataMarginRight);
    }

    //绘制占比
    ctx.fillStyle = line_chart_style.fontColor;
    var proportion = count_proportion();
    for (var i = 0; i < value.length; i++) {
        ctx.font = line_chart_style.fontSize + ' ' + line_chart_style.fontFamily;
        ctx.fillText(proportion[i].toString() + '%', coor[i].x, coor[i].y - (20 * zoomValue));
    }
}

function setBackground() {
    //保证先等图片加载完毕，绘制背景后，再绘制其他的内容
    return new Promise(function (resolve, reject) {
        clearBoard();
        const backgroundImg = new Image();
        backgroundImg.src = './images/background/bg2.jpg';

        backgroundImg.onload = function () {

            //https://www.runoob.com/jsref/prop-canvas-globalalpha.html

            //透明度
            ctx.globalAlpha = 0.5;
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
            resolve();
        };
    });
}


//主程序，打开网页时运行
//https://cloud.tencent.com/developer/article/1665737
async function mainFunc() {

    initial();

    await setBackground();

    paint_y_axis();
    paint_x_axis();

    paint_line_chart();

    if (hide.histogram == false)
        histogram_style(false, null, null, null, true);

}

//initial();
//mainFunc();


//柱状图产量的排序
var valueOrderType = document.querySelectorAll(".valueOrderSetting input");
for (var i = 0; i < valueOrderType.length; i++) {

    valueOrderType[i].addEventListener('click', function () {

        for (var j = 0; j < valueOrderType.length; j++)
            valueOrderType[j].checked = false;
        this.checked = true;

        //按年排序的勾选框全部置为空
        var yearOrderType = document.querySelectorAll('.yearOrderSetting input');
        for (var j = 0; j < yearOrderType.length; j++)
            yearOrderType[j].checked = false;

        var type = this.getAttribute("id");

        //默认
        if (type == "value_original") {
            order.value = 0;

            originDataValue = JSON.parse(localStorage.getItem('value'));
            originDataYear = JSON.parse(localStorage.getItem('year'));
            year = originDataYear;
            value = originDataValue;

            //被筛选过的数据按照默认序号排序
            if (filterMark != null) {
                var newYear = [];
                var newValue = [];

                for (var i = 0; i < value.length; i++) {
                    if (filterMark[i]) {
                        newYear.push(year[i]);
                        newValue.push(value[i]);
                    }
                }

                year = newYear;
                value = newValue;
            }
        }

        //升序
        else if (type == "value_ascending") {
            order.value = 1;
            var sorted = insertionSort_ascending(value, year);
            value = sorted.Value;
            year = sorted.Year;
        }

        //降序
        else if (type == "value_descending") {
            order.value = 2;
            var sorted = insertionSort_descending(value, year);
            value = sorted.Value;
            year = sorted.Year;
        }

        order.value = 0;

        if (hide.histogram) {
            histogram_style(true, null, null, null, null);
        }
        else {
            mainFunc();
        }

    })
}

//柱状图年份的排序
var yearOrderType = document.querySelectorAll('.yearOrderSetting input');
for (var i = 0; i < yearOrderType.length; i++) {
    yearOrderType[i].addEventListener('click', function () {

        for (var j = 0; j < yearOrderType.length; j++)
            yearOrderType[j].checked = false;
        this.checked = true;

        //按产量序的勾选框全部置为空
        var valueOrderType = document.querySelectorAll('.valueOrderSetting input');
        for (var j = 0; j < valueOrderType.length; j++)
            valueOrderType[j].checked = false;

        var type = this.getAttribute("id");

        //默认
        if (type == "year_original") {
            order.year = 0;
            originDataValue = JSON.parse(localStorage.getItem('value'));
            originDataYear = JSON.parse(localStorage.getItem('year'));
            year = originDataYear;
            value = originDataValue;

            //被筛选过的数据按照默认序号排序
            if (filterMark != null) {
                var newYear = [];
                var newValue = [];

                for (var i = 0; i < value.length; i++) {
                    if (filterMark[i]) {
                        newYear.push(year[i]);
                        newValue.push(value[i]);
                    }
                }

                year = newYear;
                value = newValue;
            }
        }

        //升序
        else if (type == "year_ascending") {
            order.year = 1;
            var sorted = insertionSort_ascending(year, value);
        }

        //降序
        else if (type == "year_descending") {
            order.year = 2;
            var sorted = insertionSort_descending(year, value);
        }

        order.year = 0;

        if (hide.histogram) {
            histogram_style(true, null, null, null, null);
        }
        else {
            mainFunc();
        }

    })
}

//数据筛选
var dataFileringOptions = document.getElementById("data_filtering");
dataFileringOptions.addEventListener("click", function () {

    var type = document.getElementById("data_filtering").value;

    originDataValue = JSON.parse(localStorage.getItem('value'));
    originDataYear = JSON.parse(localStorage.getItem('year'));
    year = originDataYear;
    value = originDataValue;
    n = year.length;


    //范围弹窗
    if (document.getElementById("range_options").style.display == "block" ||
        document.getElementById("percentage_options").style.display == "block") {
        document.getElementById("range_options").style.display = "none";
        document.getElementById("percentage_options").style.display = "none";
        dataFileringOptions.value = "none";

        return;
    }

    //不筛选
    if (type == "none") {
        dataFilterType.default = true;
        filterMark = null;
        //return;
    }

    else if (type == "above_avg" || type == "below_avg") {

        var sum = 0;
        for (var i = 0; i < value.length; i++) {
            sum += parseFloat(value[i]);
        }
        var avg = (parseFloat(sum) / value.length);

        console.log(sum, value.length, avg);

        var newYear = [];
        var newValue = [];
        var selectedMark = [];

        for (var i = 0; i < n; i++) {

            //筛选大于均值的
            if (type == "above_avg") {

                if (value[i] >= avg) {
                    newYear.push(year[i]);
                    newValue.push(value[i]);
                    selectedMark.push(true);

                }
                else {
                    selectedMark.push(false);
                }
                continue;
            }

            //筛选小于均值的
            if (type == "below_avg") {

                if (value[i] <= avg) {
                    newYear.push(year[i]);
                    newValue.push(value[i]);
                    selectedMark.push(true);
                }
                else {
                    selectedMark.push(false);
                }
                continue;
            }
        }

        console.log(newYear, newValue);

        year = newYear;
        value = newValue;
        filterMark = selectedMark;
        n = year.length;
    }

    else if (type == "range") {
        var rangeOptions = document.getElementById("range_options");
        var rangeOptionsStyle = rangeOptions.getAttribute("style");
        //console.log(rangeOptions);
        //console.log(rangeOptionsStyle);
        rangeOptions.style.display = "block";
        return;

        //响应操作间下方
    }

    else if (type == "percentage") {
        document.getElementById("percentage_options").style.display = "block";
        return;
    }

    mainFunc();
});


var rangeOptions = document.getElementById("range_options");
var rangeOptionsInputs = document.querySelectorAll("#range_options input");
//OK按钮被按下之后
rangeOptionsInputs[2].addEventListener("click", function () {

    var rangeOptions = document.getElementById("range_options");
    rangeOptions.style.display = "none";

    var rangeMinValue = parseFloat(rangeOptionsInputs[0].value);
    var rangeMaxValue = parseFloat(rangeOptionsInputs[1].value);

    if (rangeMaxValue < rangeMinValue) {
        alert("设置失败！！最大值不能小于最小值！！请重新设置");
    }

    else {
        var newYear = [];
        var newValue = [];
        var selectedMark = [];

        for (var i = 0; i < n; i++) {

            //选择在范围内的
            if (value[i] >= rangeMinValue && value[i] <= rangeMaxValue) {
                newYear.push(year[i]);
                newValue.push(value[i]);
                selectedMark.push(true);
            }
            else {
                selectedMark.push(false);
            }
        }

        console.log(newYear, newValue);

        year = newYear;
        value = newValue;
        filterMark = selectedMark;
        n = year.length;

        mainFunc();
    }
});

document.getElementById("select_percentage").addEventListener("input", function () {
    document.getElementById("percentage_options").style.display = "none";
    var percentage = document.getElementById("select_percentage").value;
    var newYear = [];
    var newValue = [];
    var selectedMark = [];
    var orderedValue = [...value];
    orderedValue.sort(function (a, b) { return b - a });
    for (var i = 0; i < n; i++) {
        if (parseInt(value[i]) >= parseInt(orderedValue[Math.floor(n * percentage / 100 - 1)])) {
            newYear.push(year[i]);
            newValue.push(value[i]);
            selectedMark.push(true);
        } else {
            selectedMark.push(false);
        }
    }
    year = newYear;
    value = newValue;
    filterMark = selectedMark;
    n = year.length;

    mainFunc();
});

// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================

// 将有效输入数据添加到表单中
function addDataToTable() {
    // 从输入框中获取输入的数据
    var yearInputBox = document.getElementById('input_year');
    var productionInputBox = document.getElementById('input_value');
    var curInputYear = yearInputBox.value;
    var curInputProduction = productionInputBox.value;

    // 若其中一个输入为空，不进行处理
    if (!curInputYear || !curInputProduction) {
        alert("年份或产量不能为空！");
        return;
    }

    // 创建年份单元格
    var tdYear = document.createElement("td");
    var textYear = document.createTextNode(curInputYear);
    tdYear.appendChild(textYear);

    // 创建产量单元格
    var tdProduction = document.createElement("td");
    var textProduction = document.createTextNode(curInputProduction);
    tdProduction.appendChild(textProduction);

    // 创建操作单元格
    var tdA = document.createElement("td");
    var eleA = document.createElement("a");
    eleA.setAttribute("href", "javascript:void(0);");
    eleA.setAttribute("onclick", "deleteTr(this);");
    var textA = document.createTextNode("删除");
    eleA.appendChild(textA);
    tdA.appendChild(eleA);

    // 添加单元格到表格行
    var tr = document.createElement("tr");
    tr.appendChild(tdYear);
    tr.appendChild(tdProduction);
    tr.appendChild(tdA);

    var table = document.getElementsByTagName("table")[0];
    table.appendChild(tr);
}

// 删除单行输入数据
function deleteTr(obj) {
    var table = obj.parentNode.parentNode.parentNode;
    // 获取te节点
    var tr = obj.parentNode.parentNode;
    // 删除（并返回）当前节点的指定子节点。
    table.removeChild(tr);
}

// 清空表单数据
function clearTable() {
    var all_data = document.querySelectorAll('tr');

    //只有标题，没有元素，无法清除，页面不变
    if (all_data.length <= 1) {
        return;
    }

    for (var i = 1; i < all_data.length; i++) {
        var tbody = all_data[i].parentNode;
        tbody.removeChild(all_data[i]);
    }
}

// 恢复之前的数据
function restoreData() {

    clearTable();
    var value = JSON.parse(localStorage.getItem('value'));
    var year = JSON.parse(localStorage.getItem('year'));

    console.log(year);
    console.log(value);

    for (var i = 0; i < year.length; i++) {
        var tr = document.createElement('tr');
        tbody.appendChild(tr);

        var td = document.createElement('td');
        td.innerHTML = year[i];
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = value[i];
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = '<a href="javascript:void(0);" onclick="deleteTr(this);">删除</a>';
        tr.appendChild(td);
    }
}

//缩放功能
var zoomOption = document.getElementById("zoom_");
zoomOption.addEventListener("change", function () {

    zoomValue = zoomOption.value;
    tickRangeHeight = 50 * zoomOption.value;
    dataMarginLeft = 20 * zoomOption.value;
    dataMarginRight = 20 * zoomOption.value;
    dataWidth = 50 * zoomOption.value;
    topHeight = 10 * zoomOption.value;
    maxDataHeight = N_tick * tickRangeHeight;

    if (parseFloat(zoomValue) != 1) {

        var newFontSize = 20 * zoomOption.value;
        if (newFontSize > 35)
            newFontSize = 35;

        defaultFontStyle = `${newFontSize}px serif`;
        line_chart_style.fontSize = `${newFontSize}px`;
    }

    else {
        defaultFontStyle = "20px serif";
        line_chart_style.fontSize = "18px";
    }

    initial();
    mainFunc();
})

restoreData();

//产量年份排序与数据过滤选项设定复原
function resetDataOrderFilterOptions() {

    var dataFilteringOptions = document.getElementById("data_filtering");
    dataFilteringOptions.value = "none";

    var yearOrderOptions = document.querySelectorAll(".yearOrderSetting input")
    for (var i = 0; i < yearOrderOptions.length; i++)
        yearOrderOptions[i].checked = false;

    var valueOrderOptions = document.querySelectorAll(".valueOrderSetting input")
    for (var i = 0; i < valueOrderOptions.length; i++)
        valueOrderOptions[i].checked = false;

    order.year = order.value = 0
}

//获取图表
function getChart() {

    resetDataOrderFilterOptions();

    var all_data = document.querySelectorAll('tr');

    //只有标题，没有元素
    if (all_data.length <= 1) {
        alert("数据为空，无法生成图表，请添加数据！");
        return;
    }

    var year = new Array();
    var value = new Array();

    for (var i = 1; i < all_data.length; i++) {

        var chart_data = all_data[i].querySelectorAll('td');
        year.push(chart_data[0].innerText);
        value.push(chart_data[1].innerText);
    }

    console.log(year);
    console.log(value);

    localStorage.clear();
    localStorage.setItem('year', JSON.stringify(year));
    localStorage.setItem('value', JSON.stringify(value));

    firstInitial();
    initial();
    mainFunc();
}