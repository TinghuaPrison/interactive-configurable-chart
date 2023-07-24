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
        var x = (0.6 * minProduction - 1) / 0.6;
        var newOriginValue = Math.floor(x);
        originProduct = newOriginValue;
        transformedMaxValue = maxValue - newOriginNumber;
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
var maxDataHeight;

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
    color1: "rgb(18, 179, 138)",
    color2: "rgb(217, 236, 232)",
    pattern: null,
};

//初始化
function initial() {

    originDataValue = JSON.parse(localStorage.getItem('value'));
    originDataYear = JSON.parse(localStorage.getItem('year'));

    value = originDataValue;
    year = originDataYear;

    n = value.length;

    //先计算
    count2();

    var originValue = result[0];
    var tickRange = result[2]; // 刻度线的高度
    var numIntervals = result[3]; // 刻度线数量

    //y轴
    var yAxisStart = tickRangeHeight * (numIntervals + 1) + yMarginTop; // y轴起点的y坐标
    var yAxisEnd = yAxisStart - tickRangeHeight * (numIntervals + 2);// y轴终点的y坐标

    originPoint.x = yMarginLeft;
    originPoint.y = yAxisStart;

    yAxisEndPoint.x = originPoint.x;
    yAxisEndPoint.y = yAxisEnd;

    //x轴
    var xAxisStart = originPoint.x; // y轴起点的y坐标
    var xAxisEnd = originPoint.x + (dataWidth * n) + (dataMarginLeft * n) + (dataMarginRight * n);// y轴终点的y坐标

    xAxisEndPoint.x = xAxisEnd;
    xAxisEndPoint.y = originPoint.y;

    //数据
    maxDataHeight = numIntervals * tickRangeHeight;

    //缩放画布
    canvas.height = originPoint.y + 100;
    canvas.width = xAxisEndPoint.x + 100;

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
    ctx.font = "16px serif";
    ctx.fillText("产量（万吨）", originPoint.x + 50, yAxisEndPoint.y - 25);

    //y轴刻度值与刻度坐标
    var yVal = result[0];
    var yPos = originPoint.y;

    //绘制y轴刻度 （产量）
    for (var i = 0; i <= numIntervals + 1; i++) {

        var y = (parseFloat(yVal)).toFixed(2);
        //console.log(y, y_pos + yMarginTop);

        // 绘制刻度线
        ctx.beginPath();
        ctx.moveTo(yMarginLeft - 5, yPos);
        ctx.lineTo(yMarginLeft, yPos);
        ctx.stroke();

        // 绘制刻度值
        ctx.font = "15px serif";
        ctx.fillText(y.toString(), yMarginLeft - 10, yPos);

        yVal = parseFloat(y) + parseFloat(tickRange);
        yPos -= tickRangeHeight;//50
    }


}

//绘制x轴
function paint_x_axis() {

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
    ctx.font = "16px serif";
    ctx.fillText("年份", xAxisEndPoint.x + 50, originPoint.y);

    var coor_x = originPoint.x;

    //绘制x轴刻度（年份）
    for (var i = 0; i < n; i++) {

        //左边距
        coor_x += dataMarginLeft;

        //绘制年份
        ctx.textAlign = "center";
        ctx.fillStyle = "black"
        ctx.font = "16px serif";
        ctx.fillText(year[i].toString(), coor_x + dataWidth / 2, originPoint.y + 20);

        //右边距
        coor_x += (dataWidth + dataMarginRight);
    }

}

//绘制柱状图
function paint_histogram(solid, gradient, pattern, before, shadow, show_num_label) {

    var coor_x = originPoint.x;
    var coor_y = originPoint.y;

    for (var i = 0; i < n; i++) {

        //计算矩形高度

        var dataHeight = (parseFloat(value[i]) - result[0]) * (maxDataHeight / (result[1] - result[0]));
        coor_x += dataMarginLeft;

        //https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes


        //单色
        if (solid != null) {
            ctx.fillStyle = solid;

            style_before.solid = solid;
            style_before.color1 = style_before.color2 = style_before.pattern = null;
        }

        //渐变色
        else if (gradient != null) {
            var grd = ctx.createLinearGradient(coor_x + dataWidth / 2, coor_y, coor_x + dataWidth / 2, coor_y - dataHeight);
            grd.addColorStop(0, gradient.color1);
            grd.addColorStop(1, gradient.color2);
            ctx.fillStyle = grd;

            style_before.solid = style_before.pattern = null;
            style_before.color1 = gradient.color1;
            style_before.color2 = gradient.color2;
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
        }

        //恢复之前的样式
        else if (before != null) {

            //单色
            if (style_before.solid != null)
                ctx.fillStyle = style_before.solid;

            //渐变色
            else if (style_before.color1 != null) {
                var grd = ctx.createLinearGradient(coor_x + dataWidth / 2, coor_y, coor_x + dataWidth / 2, coor_y - dataHeight);
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
            var grd = ctx.createLinearGradient(coor_x + dataWidth / 2, coor_y, coor_x + dataWidth / 2, coor_y - dataHeight);
            grd.addColorStop(0, "rgb(18, 179, 138)");
            grd.addColorStop(1, "rgb(217, 236, 232)");
            ctx.fillStyle = grd;

            style_before.solid = null;
            style_before.color1 = "rgb(18, 179, 138)";
            style_before.color2 = "rgb(217, 236, 232)";
        }

        //绘制矩形
        ctx.beginPath();
        ctx.moveTo(coor_x, coor_y);
        ctx.lineTo(coor_x, coor_y - dataHeight);
        ctx.lineTo(coor_x + dataWidth, coor_y - dataHeight);
        ctx.lineTo(coor_x + dataWidth, coor_y);
        ctx.lineTo(coor_x, coor_y);
        ctx.fill();

        //设置阴影
        if (shadow) {

            //设置阴影参数
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

            //绘制阴影
            ctx.beginPath();
            ctx.moveTo(coor_x, coor_y);
            ctx.lineTo(coor_x, coor_y - dataHeight);
            ctx.lineTo(coor_x + dataWidth, coor_y - dataHeight);
            ctx.lineTo(coor_x + dataWidth, coor_y);
            ctx.lineTo(coor_x, coor_y);
            ctx.fill();

            //恢复阴影设置参数
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = null;
        }

        //显示产量的数字
        if (show_num_label) {
            ctx.textAlign = "center";
            ctx.fillStyle = "black"
            ctx.font = "16px serif";
            ctx.fillText(value[i].toString(), coor_x + dataWidth / 2, coor_y - dataHeight - 15);
        }

        //递增
        coor_x += (dataWidth + dataMarginRight);
    }

}

//先选择样式再绘画的接口
function histogram_style(_hide, solid, gradient, pattern, before) {


    //隐藏柱状图
    if (_hide == true) {

        //重绘背景
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#e5f7ff"; // 设置Canvas背景颜色为白色
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //重绘坐标轴
        paint_y_axis();
        paint_x_axis();

        //重绘折状图
        paint_line_chart();
        return;

    }

    else {

        //单色
        if (solid != null) {

            var solid_color = document.getElementById("solid_color").value;
            paint_histogram(solid_color, null, null, null, false, false);
        }

        //渐变色
        else if (gradient != null) {

            var grd_color1 = document.getElementById("grd_color1").value;
            var grd_color2 = document.getElementById("grd_color2").value;
            var gradient_color = { color1: grd_color1, color2: grd_color2 };
            paint_histogram(null, gradient_color, null, null, false, false);
        }

        //纹理样式
        else if (pattern != null) {
            //https://www.twle.cn/l/yufei/canvas/canvas-basic-pattern.html
            var img = new Image();
            img.src = pattern.img;


            //加载好了才绘柱状图
            img.onload = function () {
                //if (hide.histogram == false)

                paint_histogram(null, null, pattern, null, false, false);
            };

        }

        //恢复之前的样式
        else if (before != null) {

            if (style_before.pattern != null) {
                var img = new Image();
                img.src = style_before.pattern.img;

                img.onload = function () {
                    if (hide.histogram == false)
                        paint_histogram(null, null, null, before, true, true);
                };
            }

            else {
                paint_histogram(null, null, null, before, true, true);
            }
        }

        //默认颜色
        else {
            paint_histogram(null, null, null, null, false, false);
        }

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


/* 柱状图样式设置，只能选一个 */
//https://blog.csdn.net/m0_64074850/article/details/125894773
var checkbox_style = document.querySelectorAll(".histogram_style input");
for (var i = 1; i < checkbox_style.length; i++) {

    if (checkbox_style[i].getAttribute("type") == "checkbox") {

        checkbox_style[i].addEventListener('click', function () {

            for (var j = 1; j < checkbox_style.length; j++)
                if (checkbox_style[j].getAttribute("type") == "checkbox")
                    checkbox_style[j].checked = false;
            this.checked = true;
        })
    }
}

//柱状图样式“设置”按钮被点击后
var submit_histogram_style = document.getElementById("submit_histogram_style");
submit_histogram_style.onclick = function () {

    var hide = document.getElementById("hide_histogram").checked;
    var solid = document.getElementById("solid").checked;
    var gradient = document.getElementById("gradient").checked;
    var pattern = document.getElementById("pattern").checked;
    var _default = document.getElementById("default").checked;

    //solid单色
    if (solid) {

        console.log("name");
        histogram_style(false, true, null, null, null);
    }

    //渐变色
    else if (gradient) {
        console.log("gradient");
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
            histogram_style(false, null, null, patternStyle, null);
        }
        else {
            alert("您没有导入纹理样式！");
        }
    }

    //默认
    else if (_default) {
        histogram_style(false, null, null, null, null);
    }

    //无效设置
    else {
        alert("设置失败，您没有勾选其中一种！");
    }

    //隐藏
    if (hide) {
        histogram_style(true, null, null, null, null);
        return;
    }
}

//计算每个数据的占比%
function count_proportion() {
    var prop = [];
    var sum = 0;

    for (var i = 0; i < value.length; i++)
        sum += parseFloat(value[i]);

    for (var i = 0; i < value.length; i++) {
        prop.push((sum / parseFloat(value[i])).toFixed(2));
    }

    return prop;
}


//绘制折线图
function paint_line_chart() {

    var coor_x = originPoint.x;
    var coor = [];

    //先绘制圆圈
    for (var i = 0; i < n; i++) {

        //计算矩形高度
        var dataHeight = (value[i] - result[0]) * (maxDataHeight / (result[1] - result[0]));
        coor_x += dataMarginLeft;

        ctx.beginPath();
        //http://caibaojian.com/html5-canvas-arc.html
        //https://blog.csdn.net/Jacgu/article/details/106378627
        ctx.arc(coor_x + dataWidth / 2, originPoint.y - dataHeight - 40, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        coor.push({ x: coor_x + dataWidth / 2, y: originPoint.y - dataHeight - 40 });

        //递增
        coor_x += (dataWidth + dataMarginRight);
    }

    //console.log(coor);

    //绘制折线
    ctx.fillStyle = 'black';
    for (var i = 0; i < coor.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(coor[i].x, coor[i].y);
        ctx.lineTo(coor[i + 1].x, coor[i + 1].y);
        ctx.stroke();
    }

    //绘制占比
    var proportion = count_proportion();
    for (var i = 0; i < value.length; i++) {
        ctx.font = "16px serif";
        ctx.fillText(proportion[i].toString() + '%', coor[i].x, coor[i].y - 20);
    }
}


//主程序，打开网页时运行
function main() {

    clearBoard();
    paint_y_axis();
    paint_x_axis();


    histogram_style(false, null, null, null, true);
    paint_line_chart();
}

initial();
main();


//柱状图产量的排序
var valueOrderType = document.querySelectorAll('.value_order input');
for (var i = 0; i < valueOrderType.length; i++) {
    valueOrderType[i].addEventListener('click', function () {

        for (var j = 0; j < valueOrderType.length; j++)
            valueOrderType[j].checked = false;
        this.checked = true;

        //按年排序的勾选框全部置为空
        var yearOrderType = document.querySelectorAll('.year_order input');
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
            main();
        }

    })
}

//柱状图年份的排序
var yearOrderType = document.querySelectorAll('.year_order input');
for (var i = 0; i < yearOrderType.length; i++) {
    yearOrderType[i].addEventListener('click', function () {

        for (var j = 0; j < yearOrderType.length; j++)
            yearOrderType[j].checked = false;
        this.checked = true;

        //按产量序的勾选框全部置为空
        var valueOrderType = document.querySelectorAll('.value_order input');
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
            main();
        }

    })
}

//返回求改数据页面
var quit = document.getElementById('quit');
quit.onclick = function () {
    window.location.href = "./input.html";
}