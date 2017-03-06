// 利用setTimeout 实现setInterval和clearInterval方法
// mySetInterval返回值为第一次执行时产生的timeoutId,以这个ID为key，每次执行时产生的ID为值，更新全局对象

let intervalIdsManger = {};

function mySetInterval(func, time) {
    if (typeof func !== 'function') {
        func = function() {};
    }

    let intervalId = null;

    function doInterval() {
        let timeoutId = setTimeout(() => {
            intervalIdsManger[intervalId] = doInterval(func, time);
            func();
        }, time);

        intervalId = intervalId || timeoutId;
        intervalIdsManger[intervalId] = timeoutId;

        return timeoutId;
    }

    doInterval();
    return intervalId;
}

function myClearInterval(intervalId) {
    clearTimeout(intervalIdsManger[intervalId]);
    return (delete intervalIdsManger[intervalId]);
}

// mySetInterval使用方法
let interval1 = mySetInterval(() => console.log(1111), 2000);
let interval2 = mySetInterval(() => console.log(2222), 3000);

setTimeout(() => {
    // myClearInterval使用方法
    myClearInterval(interval1);
    myClearInterval(interval2);
}, 60 * 1000);
