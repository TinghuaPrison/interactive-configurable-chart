/*
    刻度计算算法，基于魔术数组 [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
    解释：魔数数组是理想间隔数组，即我们希望每个刻度的间隔都是魔数数组中某个数的整数倍。（准确的来说是整10倍）
*/
//新增，解决js的浮点数存在精度问题，在计算出最后结果时可以四舍五入一次，因为刻度太小也没有意义，所以这里忽略设置精度为8位
function fixedNum(num) {
    if (("" + num).indexOf('.') >= 0) num = parseFloat(num.toFixed(8));
    return num;
}
//1.初始化
var symmetrical = false;//是否要求正负刻度对称。默认为false，需要时请设置为true
var deviation = false;//是否允许误差，即实际分出的段数不等于splitNumber
var magic = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];//魔数数组经过扩充，放宽魔数限制避免出现取不到魔数的情况。
//var arr = [1230, 320, 20, 304, 102, 234];//测试数据
//var arr = [123.2, 124.3, 125.3, 122.3, 122.9, 121.5];
var arr = [2, 3, 4, 5];
var max, min, splitNumber;
splitNumber = 5;//理想的刻度间隔段数，即希望刻度区间有多少段
max = Math.max.apply(null, arr);//调用js已有函数计算出最大值
min = Math.min.apply(null, arr);//计算出最小值
//2.计算出初始间隔tempGap和缩放比例multiple
var tempGap = (max - min) / splitNumber;//初始刻度间隔的大小。
//设tempGap除以multiple后刚刚处于魔数区间内，先求multiple的幂10指数，例如当tempGap为120，想要把tempGap映射到魔数数组（即处理为10到100之间的数），则倍数为10，即10的1次方。
var multiple = Math.floor(Math.log10(tempGap) - 1);//这里使用Math.floor的原因是，当Math.log10(tempGap)-1无论是正负数都需要向下取整。不能使用parseInt或其他取整逻辑代替。
multiple = Math.pow(10, multiple);//刚才是求出指数，这里求出multiple的实际值。分开两行代码避免有人看不懂
//3.取出邻近较大的魔数执行第一次计算
var tempStep = tempGap / multiple;//映射后的间隔大小
var estep;//期望得到的间隔
var lastIndex = -1;//记录上一次取到的魔数下标，避免出现死循环
for (var i = 0; i < magic.length; i++) {
    if (magic[i] > tempStep) {
        estep = magic[i] * multiple;//取出第一个大于tempStep的魔数，并乘以multiple作为期望得到的最佳间隔
        break;
    }
}
//4.求出期望的最大刻度和最小刻度，为estep的整数倍
var maxi, mini;
function countDegree(estep) {
    //这里的parseInt是我无意中写出来的，本来我是想对maxi使用Math.floor，对mini使用Math.ceil的。这样能向下取到邻近的一格，不过后面发现用parseInt好像画出来图的比较好看
    maxi = parseInt(max / estep + 1) * estep;//最终效果是当max/estep属于(-1,Infinity)区间时，向上取1格，否则取2格。
    mini = parseInt(min / estep - 1) * estep;//当min/estep属于(-Infinity,1)区间时，向下取1格，否则取2格。
    //如果max和min刚好在刻度线的话，则按照上面的逻辑会向上或向下多取一格
    if (max === 0) maxi = 0;//这里进行了一次矫正，优先取到0刻度
    if (min === 0) mini = 0;
    if (symmetrical && maxi * mini < 0) {//如果需要正负刻度对称且存在异号数据
        var tm = Math.max(Math.abs(maxi), Math.abs(mini));//取绝对值较大的一方
        maxi = tm;
        mini = -tm;
    }
}
countDegree(estep);
if (deviation) {//如果允许误差，即实际分段数可以不等于splitNumber，则直接结束
    var interval = fixedNum(estep);
    console.log(maxi, mini, interval);
    return;
}
//5.当正负刻度不对称且0刻度不在刻度线上时，重新取魔数进行计算//确保其中一条分割线刚好在0刻度上。
else if (!symmetrical || maxi * mini > 0) {
    outter: do {
        //计算模拟的实际分段数
        var tempSplitNumber = Math.round((maxi - mini) / estep);
        //当趋势单调性发生变化时可能出现死循环，需要进行校正
        if ((i - lastIndex) * (tempSplitNumber - splitNumber) < 0) {//此处检查单调性变化且未取到理想分段数
            //此处的校正基于合理的均匀的魔数数组，即tempSplitNumber和splitNumber的差值较小如1和2，始终取大刻度
            while (tempSplitNumber < splitNumber) {//让maxi或mini增大或减少一个estep直到取到理想分段数
                if ((mini - min) <= (maxi - max) && mini != 0 || maxi == 0) {//在尽量保留0刻度的前提下，让更接近最值的一边扩展一个刻度
                    mini -= estep;
                } else {
                    maxi += estep;
                }
                tempSplitNumber++;
                if (tempSplitNumber == splitNumber)
                    break outter;
            }
        }
        //当魔数下标越界或取到理想分段数时退出循环
        if (i >= magic.length - 1 || i <= 0 || tempSplitNumber == splitNumber) break;
        //记录上一次的魔数下标
        lastIndex = i;
        //尝试取符合趋势的邻近魔数
        if (tempSplitNumber > splitNumber) estep = magic[++i] * multiple;
        else estep = magic[--i] * multiple;
        //重新计算刻度
        countDegree(estep);
    } while (tempSplitNumber != splitNumber);
}
//6.无论计算始终把maxi-mini分成splitNumber段，得到间隔interval。不过前面的算法已经尽量的保证刻度最优了，即interval接近或等于理想刻度estep。
maxi = fixedNum(maxi);
mini = fixedNum(mini);
var interval = fixedNum((maxi - mini) / splitNumber);
console.log(maxi, mini, interval);