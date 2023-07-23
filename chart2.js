var min;
var max;
var n;
const N_tick = 5;

//https://www.baeldung.com/cs/choosing-linear-scale-y-axis
function main() {
    //var arr = [123.2, 124.3, 125.3, 122.3, 122.9, 121.5];
    var arr = [2, 3, 4, 5];
    n = arr.length;

    max = Math.max.apply(null, arr);
    min = Math.min.apply(null, arr);
    console.log("min:" + min + " max: " + max);

    var range = max - min;
    var tick_range = range / N_tick;

    var new_lower = tick_range.toFixed(2) * Math.ceil(min / tick_range.toFixed(2));
    var new_upper = tick_range.toFixed(2) * Math.ceil(1 + (max / tick_range.toFixed(2)));

    console.log(new_lower.toFixed(1));
    console.log(new_upper.toFixed(1));
    //console.log(tick_range);
    console.log(tick_range.toFixed(2));
}

main();