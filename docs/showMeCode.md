# 36 道 JS 手写题

## 数据类型判断

```js
function typeOf(obj) {
  let res = Object.prototype.toString.call(obj).slice(8, -1);
  return res;
}
```

## 继承

### 原型链继承

```js
function Animal() {
  this.color = ["black", "white"];
}
Animal.prototype.getColor = function () {
  return this.color;
};
function Dog() {}

Dog.prototype = new Animal();
let dog1 = new Dog();
dog1.color.push("red");
let dog2 = new Dog();
console.log(dog2);
```

原型中包含的引用类型将于所有实例共享

子类在实例化时不能给父类构造函数传参

### 构造函数实现继承

```js
function Animal(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
}
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = new Animal();
```

借用构造函数实现继承解决了原型链继承的 2 个问题：引用类型共享问题以及传参问题。但是由于方法必须定义在构造函数中，所以会导致每次创建子类实例都会创建一遍方法。

### 组合继承

使用原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性。可以把方法定义在原型上以实现重用，又让每个实例都有自己的属性

```js
function Animal(name) {
  this.name = name;
  this.color = ["black", "red"];
}
Animal.prototype.getName() = function () {
  return this.name;
};

function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}
Dog.prototype = new Animal();
Dog.prototype.contructor = Dog;
let dog1 = new Dog("奶昔", 2);
dog1.color.push("brown");
let dog2 = new Dog('石榴'，1);
console.log(dog2)
```

### 寄生式组合继承

组合继承的问题是调用了 2 次父类构造函数，第一次是在 new Animal(),第二次是 Animal.call()
解决方案不直接调用父类构造函数给子类原型赋值 通过创建空函数 F 获取父类原型

```js
function Animal(name) {
  this.name = name;
  this.color = ["blue", "red"];
}

Animal.prototype.getName = function () {
  return this.name;
};

function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}

function F() {}
F.prototype = Animal.prototype;
let f = new F();
f.contructor = Dog;
Dog.prototype = f;
```

### class 继承

```js
class Animal {
  constructor(name){
    this.name = name
  }
  getName(){
    return this.name
  }
}
class Dog extend Animal{
  constructor(name,age){
      super(name)
      this.age = age
  }
}
```

### 数组去重

es5

```js
function unique(arr) {
  var res = arr.filter(function (item, index, array) {
    return array.indexOf(item) === index;
  });
  return res;
}
```

es6

```js
var unique = (arr) => [...new Set(arr)];
```

### 数组扁平化

flat 的实现
递归

```js
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i]){
      result = result.concat(flatten(arr[i]))
    }else{
      result.push(arr[i])
    }
  }
    return result;
}
```

es6

```js
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

### 深浅拷贝

浅拷贝：只考虑对象类型。

```js
function shallowCopy(obj) {
  if (typeof obj !== "object") return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```

简单版深拷贝：只考虑普通对象属性，不考虑内置对象和函数。

```js
function deepClone(obj) {
  if (typeof obj !== "object") return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
}
```

复杂版深拷贝 内置对象的处理 Date、RegExp 等对象和函数以及解决了循环引用的问题。
(map)
https://segmentfault.com/a/1190000020255831

```js
const isObject = (target) =>
  (typeof target === "object" || typeof target === "function") &&
  target !== null;

function deepClone(target, map = new WeakMap()) {
  if (map.get(target)) {
    return target;
  }
  // 获取当前值的构造函数：获取它的类型
  let constructor = target.constructor;
  // 检测当前对象target是否与正则、日期格式对象匹配
  if (/^(RegExp|Date)$/i.test(constructor.name)) {
    // 创建一个新的特殊对象(正则类/日期类)的实例
    return new constructor(target);
  }
  if (isObject(target)) {
    map.set(target, true); // 为循环引用的对象做标记
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

### 事件总线（发布订阅）

```js
class EventEmitter {
  constructor() {
    this.cache = {};
  }
  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }
  off(name, fn) {
    let tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex((f) => f === fn || f.callback === fn);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    }
  }
  emit(name, once = false, ...args) {
    if (this.cache[name]) {
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
      let tasks = this.cache[name].slice();
      for (let fn of tasks) {
        fn(...args);
      }
      if (once) {
        delete this.cache[name];
      }
    }
  }
}

// 测试
let eventBus = new EventEmitter();
let fn1 = function (name, age) {
  console.log(`${name} ${age}`);
};
let fn2 = function (name, age) {
  console.log(`hello, ${name} ${age}`);
};
eventBus.on("aaa", fn1);
eventBus.on("aaa", fn2);
eventBus.emit("aaa", false, "布兰", 12);
// '布兰 12'
// 'hello, 布兰 12'
```

### 解析 URL 参数为对象

```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

### 字符串模板

```js
function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) {
    // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}
```

测试

```js
let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let person = {
  name: "布兰",
  age: 12,
};
render(template, person); // 我是布兰，年龄12，性别undefined
```

### 图片懒加载

与普通的图片懒加载不同，如下这个多做了 2 个精心处理：

图片全部加载完成后移除事件监听；
加载完的图片，从 imgList 移除；

```js
let imgList = [...document.querySelectorAll("img")];
let length = imgList.length;

const imgLazyLoad = function () {
  let count = 0;
  // 修正错误，需要加上自执行

  return (function () {
    let deleteIndexList = [];
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src;
        deleteIndexList.push(index);
        count++;
        if (count === length) {
          document.removeEventListener("scroll", imgLazyLoad);
        }
      }
    });
    imgList = imgList.filter((img, index) => !deleteIndexList.includes(index));
  })();
};

// 这里最好加上防抖处理
document.addEventListener("scroll", imgLazyLoad);
```

### 防抖

触发高频事件 N 秒后只会执行一次，如果 N 秒内事件再次触发，则会重新计时。

简单版：函数内部支持使用 this 和 event 对象；

```js
function debounce(func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}
```

使用

```js
var node = document.getElementById("layout");
function getUserAction(e) {
  console.log(this, e); // 分别打印：node 这个节点 和 MouseEvent
  node.innerHTML = count++;
}
node.onmousemove = debounce(getUserAction, 1000);
```

最终版：除了支持 this 和 event 外，还支持以下功能：

支持立即执行；
函数可能有返回值；
支持取消功能；

```js
function debounce(func, wait, immediate) {
  var timeout, result;

  var debounced = function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
```

使用

```js
var setUseAction = debounce(getUserAction, 10000, true);
// 使用防抖
node.onmousemove = setUseAction;

// 取消防抖
setUseAction.cancel();
```

### 函数节流

触发高频事件，且 N 秒内只执行一次。

简单版：使用时间戳来实现，立即执行一次，然后每 N 秒执行一次。

```js
function throttle(func, wait) {
  var context, args;
  var previous = 0;

  return function () {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

最终版：支持取消节流；另外通过传入第三个参数，options.leading 来表示是否可以立即执行一次，opitons.trailing 表示结束调用的时候是否还要执行一次，默认都是 true。
注意设置的时候不能同时将 leading 或 trailing 设置为 false。

```js
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };
  return throttled;
}
```

### 函数柯里化

什么叫函数柯里化？其实就是将使用多个参数的函数转换成一系列使用一个参数的函数的技术。还不懂？来举个例子。

```js
function curry(fn) {
  let judge = (...args) => {
    if (args.length == fn.length) return fn(...args);
    return (...arg) => judge(...args, ...arg);
  };
  return judge;
}

function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3);
let addCurry = curry(add);
addCurry(1)(2)(3);
```

### 偏函数

什么是偏函数？偏函数就是将一个 n 参的函数转换成固定 x 参的函数，剩余参数（n - x）将在下次调用全部传入。举个例子：

```js
function add(a, b, c) {
  return a + b + c;
}
let partialAdd = partial(add, 1);
partialAdd(2, 3);
```

发现没有，其实偏函数和函数柯里化有点像，所以根据函数柯里化的实现，能够能很快写出偏函数的实现：

```js
function partial(fn, ...args) {
  return (...arg) => {
    return fn(...args, ...arg);
  };
}
```

如上这个功能比较简单，现在我们希望偏函数能和柯里化一样能实现占位功能，比如：

```js
function clg(a, b, c) {
  console.log(a, b, c);
}
let partialClg = partial(clg, "_", 2);
partialClg(1, 3); // 依次打印：1, 2, 3
```

\_ 占的位其实就是 1 的位置。相当于：partial(clg, 1, 2)，然后 partialClg(3)。明白了原理，我们就来写实现：

```js
function partial(fn, ...args) {
    return (...arg) => {
        args[index] =
        return fn(...args, ...arg)
    }
}

```

### JSONP

JSONP 核心原理：script 标签不受同源策略约束，所以可以用来进行跨域请求，优点是兼容性好，但是只能用于 GET 请求；

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateUrl = () => {
    let dataSrc = "";
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${callbackName}`;
    return `${url}?${dataSrc}`;
  };
  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement("script");
    scriptEle.src = generateUrl();
    document.body.appendChild(scriptEle);
    window[callbackName] = (data) => {
      resolve(data);
      document.removeChild(scriptEle);
    };
  });
};
```

### AJAX

```js
const getJSON = function (url) {
  return new Promise((resolve, reject) => {
    const xhr = XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Mscrosoft.XMLHttp");
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  });
};
```

### 实现数组原型的方法

#### 实现 map

map 方法接收一个回调函数，函数内接收三个参数，当前项、索引、原数组，返回一个新的数组，并且数组长度不变。 知道了这些特征之后，我们用 reduce 重塑 map 。

```js
const testArr = [1, 2, 3, 4];
Array.prototype.reduceMap = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    const item = callback(cur, index, array);
    acc.push(item);
    return acc;
  }, []);
};
testArr.reduceMap((item, index) => {
  return item + index;
});
// [1, 3, 5, 7]
```

在 Array  的原型链上添加 reduceMap  方法，接收一个回调函数 callback 作为参数（就是 map  传入的回调函数），内部通过 this  拿到当前需要操作的数组，这里 reduce  方法的第二个参数初始值很关键，需要设置成一个 [] ，这样便于后面把操作完的单项塞入 acc 。我们需要给 callback  方法传入三个值，当前项、索引、原数组，也就是原生 map  回调函数能拿到的值。返回 item  塞进 acc，并且返回 acc ，作为下一个循环的 acc（贪吃蛇原理）。最终 this.reduce  返回了新的数组，并且长度不变。

#### forEach

forEach 接收一个回调函数作为参数，函数内接收四个参数当前项、索引、原函数、当执行回调函数 callback 时，用作 this 的值，并且不返回值

```js
const testArr = [1, 2, 3, 4];
Array.prototype.reduceForEach = function (callback) {
  this.reduce((acc, cur, index, array) => {
    callback(cur, index, array);
  }, []);
};

testArr.reduceForEach((item, index, array) => {
  console.log(item, index);
});
// 1234
// 0123
```

#### filter

filter 同样接收一个回调函数，回调函数返回 true 则返回当前项，反之则不返回。回调函数接收的参数同 forEach 。

```js
const testArr = [1, 2, 3, 4];
Array.prototype.reduceFilter = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    if (callback(cur, index, array)) {
      acc.push(cur);
    }
    return acc;
  }, []);
};
testArr.reduceFilter((item) => item % 2 == 0); // 过滤出偶数项。
// [2, 4]
```

filter 方法中 callback 返回的是 Boolean 类型，所以通过 if 判断是否要塞入累计器 acc ，并且返回 acc 给下一次对比。最终返回整个过滤后的数组。

#### find

find 方法中 callback 同样也是返回 Boolean 类型，返回你要找的第一个符合要求的项。

```js
const testArr = [1, 2, 3, 4];
const testObj = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
Array.prototype.reduceFind = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    if (callback(cur, index, array)) {
      if (acc instanceof Array && acc.length == 0) {
        acc = cur;
      }
    }
    // 循环到最后若 acc 还是数组，且长度为 0，代表没有找到想要的项，则 acc = undefined
    if (index == array.length - 1 && acc instanceof Array && acc.length == 0) {
      acc = undefined;
    }
    return acc;
  }, []);
};
testArr.reduceFind((item) => item % 2 == 0); // 2
testObj.reduceFind((item) => item.a % 2 == 0); // {a: 2}
testObj.reduceFind((item) => item.a % 9 == 0); // undefined
```

你不知道操作的数组是对象数组还是普通数组，所以这里只能直接覆盖 acc 的值，找到第一个符合判断标准的值就不再进行赋值操作。

#### some

```js
O.length >>> 0 是什么操作？就是无符号右移 0 位，那有什么意义嘛？就是为了保证转换后的值为正整数。其实底层做了 2 层转换，第一是非 number 转成 number 类型，第二是将 number 转成 Uint32 类型。
Array.prototype.some2 = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("this is null or not defined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    if (k in O) {
      if (callback.call(thisArg, O[k], k, O)) {
        return true;
      }
    }
    k++;
  }
  return false;
};
```

#### reduce

```js
Array.prototype.reduce2 = function (callback, initialValue) {
  if (this == null) {
    throw new TypeError("this is null or not defined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0,
    acc;

  if (arguments.length > 1) {
    acc = initialValue;
  } else {
    // 没传入初始值的时候，取数组中第一个非 empty 的值为初始值
    while (k < len && !(k in O)) {
      k++;
    }
    if (k > len) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    acc = O[k++];
  }
  while (k < len) {
    if (k in O) {
      acc = callback(acc, O[k], k, O);
    }
    k++;
  }
  return acc;
};
```

### 实现函数原型

```js

```
