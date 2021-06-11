# 36 道 JS 手写题

# 数据类型判断

```js
function typeOf(obj) {
  let res = Object.prototype.toString.call(obj).slice(8, -1);
  return res;
}
```

# 继承

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

# 数组去重

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

# 数组扁平化

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

# 深浅拷贝

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

递归
对象分类型讨论
解决循环引用（环）

```js
class DeepClone {
  constructor() {
    this.cacheList = [];
  }
  clone(source) {
    if (source instanceof Object) {
      const cache = this.findCache(source);
      if (cache) return cache;
      // 如果找到缓存，直接返回
      else {
        let target;
        if (source instanceof Array) {
          target = new Array();
        } else if (source instanceof Function) {
          target = function () {
            return source.apply(this, arguments);
          };
        } else if (source instanceof Date) {
          target = new Date(source);
        } else if (source instanceof RegExp) {
          target = new RegExp(source.source, source.flags);
        }
        this.cacheList.push([source, target]); // 把源对象和新对象放进缓存列表
        for (let key in source) {
          if (source.hasOwnProperty(key)) {
            // 不拷贝原型上的属性，太浪费内存
            target[key] = this.clone(source[key]); // 递归克隆
          }
        }
        return target;
      }
    }
    return source;
  }
  findCache(source) {
    for (let i = 0; i < this.cacheList.length; ++i) {
      if (this.cacheList[i][0] === source) {
        return this.cacheList[i][1]; // 如果有环，返回对应的新对象
      }
    }
    return undefined;
  }
}
```

尤雨希版本

```js
function find(list, f) {
  return list.filter(f)[0];
}

function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, (c) => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy,
  });
  Object.keys(obj).forEach((key) => (copy[key] = deepCopy(obj[key], cache)));

  return copy;
}
```

# 事件总线（发布订阅）

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

# 解析 URL 参数为对象

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

# 字符串模板

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

# 图片懒加载

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

# 防抖

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

# 函数节流

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

# 函数柯里化

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

# 偏函数

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

# JSONP

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

# AJAX

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

# 实现数组原型的方法

# 实现 map

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

# forEach

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

# filter

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

# find

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

# some

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

# reduce

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

# 实现函数原型

使用一个指定的 this 值和一个或多个参数来调用一个函数。

实现要点：

this 可能传入 null；
传入不固定个数的参数；
函数可能有返回值；

# call

```js
Function.prototype.call2 = function (context) {
  var context = context || window;
  context.fn =this;
  var args = []
  for(let i = 0;len = arguments.length; i < len; i++){
    args.push("arguments["+i+"]")
  }
  var result =eval('context.fn('+args+")")
    delete context.fn
    return result;
};
```

# apply

apply 和 call 一样，唯一的区别就是 call 是传入不固定个数的参数，而 apply 是传入一个数组。

实现要点：

this 可能传入 null；
传入一个数组；
函数可能有返回值；

```js
Function.prototype.apply2 = function (context, arr) {
  var context = context || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }

  delete context.fn;
  return result;
};
```

# bind

bind 方法会创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
实现要点：

bind() 除了 this 外，还可传入多个参数；
bing 创建的新函数可能传入多个参数；
新函数可能被当做构造函数调用；
函数可能有返回值；

```js
Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

# 使用 new 关键字

new 运算符用来创建用户自定义的对象类型的实例或者具有构造函数的内置对象的实例。
实现要点
new 会产生一个新对象；
新对象需要能够访问到构造函数的属性，所以需要重新指定它的原型；
构造函数可能会显示返回；

```js
function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);

  // ret || obj 这里这么写考虑了构造函数显示返回 null 的情况
  return typeof ret === "object" ? ret || obj : obj;
}

//使用
function person(name, age) {
  this.name = name;
  this.age = age;
}
let p = objectFactory(person, "布兰", 12);
console.log(p); // { name: '布兰', age: 12 }
```

# instanceof 实现

instanceof 就是判断构造函数的 prototype 属性是否出现在实例的原型链上。

```js
function instanceof(left, right) {
  let proto = left._proto_;
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) {
      return true;
    }
    proto = proto._proto_;
  }
}
```

上面的 left.proto 这种写法可以换成 Object.getPrototypeOf(left)。

# 实现 Object.create

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的*proto*。

```js
Object.create2 = function (proto, propertyObject = undefined) {
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Object prototype may only be an Object or null.");
    if (propertyObject == null) {
      new TypeError("Cannot convert undefined or null to object");
    }
    function F() {}
    F.prototype = proto;
    const obj = new F();
    if (propertyObject != undefined) {
      Object.defineProperties(obj, propertyObject);
    }
    if (proto === null) {
      // 创建一个没有原型对象的对象，Object.create(null)
      obj.__proto__ = null;
    }
    return obj;
  }
};
```

# Object.assign

```js
Object.assign2 = function (target, ...source) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  let ret = Object(target);
  source.forEach(function (obj) {
    if (obj != null) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key];
        }
      }
    }
  });
  return ret;
};
```

# 实现 JSON.stringify

JSON.stringify([, replacer [, space]) 方法是将一个 JavaScript 值(对象或者数组)转换为一个 JSON 字符串。此处模拟实现，不考虑可选的第二个参数 replacer 和第三个参数 space，如果对这两个参数的作用还不了解，建议阅读 MDN 文档。

基本数据类型：

undefined 转换之后仍是 undefined(类型也是 undefined)
boolean 值转换之后是字符串 "false"/"true"
number 类型(除了 NaN 和 Infinity)转换之后是字符串类型的数值
symbol 转换之后是 undefined
null 转换之后是字符串 "null"
string 转换之后仍是 string
NaN 和 Infinity 转换之后是字符串 "null"

函数类型：转换之后是 undefined
如果是对象类型(非函数)

如果是一个数组：如果属性值中出现了 undefined、任意的函数以及 symbol，转换成字符串 "null" ；
如果是 RegExp 对象：返回 {} (类型是 string)；
如果是 Date 对象，返回 Date 的 toJSON 字符串值；
如果是普通对象；

如果有 toJSON() 方法，那么序列化 toJSON() 的返回值。
如果属性值中出现了 undefined、任意的函数以及 symbol 值，忽略。
所有以 symbol 为属性键的属性都会被完全忽略掉。

对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

```js
function jsonStringify(data) {
  let dataType = typeof data;

  if (dataType !== "object") {
    let result = data;
    //data 可能是 string/number/null/undefined/boolean
    if (Number.isNaN(data) || data === Infinity) {
      //NaN 和 Infinity 序列化返回 "null"
      result = "null";
    } else if (
      dataType === "function" ||
      dataType === "undefined" ||
      dataType === "symbol"
    ) {
      //function 、undefined 、symbol 序列化返回 undefined
      return undefined;
    } else if (dataType === "string") {
      result = '"' + data + '"';
    }
    //boolean 返回 String()
    return String(result);
  } else if (dataType === "object") {
    if (data === null) {
      return "null";
    } else if (data.toJSON && typeof data.toJSON === "function") {
      return jsonStringify(data.toJSON());
    } else if (data instanceof Array) {
      let result = [];
      //如果是数组
      //toJSON 方法可以存在于原型链中
      data.forEach((item, index) => {
        if (
          typeof item === "undefined" ||
          typeof item === "function" ||
          typeof item === "symbol"
        ) {
          result[index] = "null";
        } else {
          result[index] = jsonStringify(item);
        }
      });
      result = "[" + result + "]";
      return result.replace(/'/g, '"');
    } else {
      //普通对象
      /**
       * 循环引用抛错(暂未检测，循环引用时，堆栈溢出)
       * symbol key 忽略
       * undefined、函数、symbol 为属性值，被忽略
       */
      let result = [];
      Object.keys(data).forEach((item, index) => {
        if (typeof item !== "symbol") {
          //key 如果是symbol对象，忽略
          if (
            data[item] !== undefined &&
            typeof data[item] !== "function" &&
            typeof data[item] !== "symbol"
          ) {
            //键值如果是 undefined、函数、symbol 为属性值，忽略
            result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
          }
        }
      });
      return ("{" + result + "}").replace(/'/g, '"');
    }
  }
}
```

# 实现 JSON.parse

介绍 2 种方法实现：

eval 实现；
new Function 实现；
eval 实现
第一种方式最简单，也最直观，就是直接调用 eval，代码如下：

```js
var json = '{"a":"1", "b":2}';
var obj = eval("(" + json + ")"); // obj 就是 json 反序列化之后得到的对象
```

但是直接调用 eval 会存在安全问题，如果数据中可能不是 json 数据，而是可执行的 JavaScript 代码，那很可能会造成 XSS 攻击。因此，在调用 eval 之前，需要对数据进行校验。

```js
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three =
  /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

if (
  rx_one.test(
    json.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")
  )
) {
  var obj = eval("(" + json + ")");
}
```

new Function 实现
Function 与 eval 有相同的字符串参数特性。

```js
var json = '{"name":"小姐姐", "age":20}';
var obj = new Function("return " + json)();
```

# 实现 promise

实现 Promise 需要完全读懂 Promise A+ 规范，不过从总体的实现上看，有如下几个点需要考虑到：

1、then 需要支持链式调用，所以得返回一个新的 Promise；
2、处理异步问题，所以得先用 onResolvedCallbacks 和 onRejectedCallbacks 分别把成功和失败的回调存起来；
3、为了让链式调用正常进行下去，需要判断 onFulfilled 和 onRejected 的类型；
4、onFulfilled 和 onRejected 需要被异步调用，这里用 setTimeout 模拟异步；
5、处理 Promise 的 resolve；

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        let resolve = (value) = > {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach((fn) = > fn());
            }
        };

        let reject = (reason) = > {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach((fn) = > fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        // 解决 onFufilled，onRejected 没有传值的问题
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) = > v;
        // 因为错误的值要让后面访问到，所以这里也要抛出错误，不然会在之后 then 的 resolve 中捕获
        onRejected = typeof onRejected === "function" ? onRejected : (err) = > {
            throw err;
        };
        // 每次调用 then 都返回一个新的 promise
        let promise2 = new Promise((resolve, reject) = > {
            if (this.status === FULFILLED) {
                //Promise/A+ 2.2.4 --- setTimeout
                setTimeout(() = > {
                    try {
                        let x = onFulfilled(this.value);
                        // x可能是一个proimise
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === REJECTED) {
                //Promise/A+ 2.2.3
                setTimeout(() = > {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() = > {
                    setTimeout(() = > {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });

                this.onRejectedCallbacks.push(() = > {
                    setTimeout(() = > {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });

        return promise2;
    }
}
const resolvePromise = (promise2, x, resolve, reject) = > {
    // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
    if (promise2 === x) {
        return reject(
            new TypeError("Chaining cycle detected for promise #<Promise>"));
    }
    // Promise/A+ 2.3.3.3.3 只能调用一次
    let called;
    // 后续的条件要严格判断 保证代码能和别的库一起使用
    if ((typeof x === "object" && x != null) || typeof x === "function") {
        try {
            // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
            let then = x.then;
            if (typeof then === "function") {
            // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
                then.call(
                    x, (y) = > {
                        // 根据 promise 的状态决定是成功还是失败
                        if (called) return;
                        called = true;
                        // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
                        resolvePromise(promise2, y, resolve, reject);
                    }, (r) = > {
                        // 只要失败就失败 Promise/A+ 2.3.3.3.2
                        if (called) return;
                        called = true;
                        reject(r);
                    });
            } else {
                // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
                resolve(x);
            }
        } catch (e) {
            // Promise/A+ 2.3.3.2
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4
        resolve(x);
    }
};

```

Promise 写完之后可以通过 promises-aplus-tests 这个包对我们写的代码进行测试，看是否符合 A+ 规范。不过测试前还得加一段代码：

```js
// promise.js
// 这里是上面写的 Promise 全部代码
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
```

全局安装：

npm i promises-aplus-tests -g
复制代码
终端下执行验证命令：

promises-aplus-tests promise.js
复制代码
上面写的代码可以顺利通过全部 872 个测试用例。

# Promise.resolve

Promsie.resolve(value) 可以将任何值转成值为 value 状态是 fulfilled 的 Promise，但如果传入的值本身是 Promise 则会原样返回它。

```js
Promise.resolve = function (value) {
  // 如果是 Promsie，则直接输出它
  if (value instanceof Promise) {
    return value;
  }
  return new Promise((resolve) => resolve(value));
};
```

# Promise.reject

和 Promise.resolve() 类似，Promise.reject() 会实例化一个 rejected 状态的 Promise。但与 Promise.resolve() 不同的是，如果给 Promise.reject() 传递一个 Promise 对象，则这个对象会成为新 Promise 的值。

```js
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};
```

# Promise.all

Promise.all 的规则是这样的：

传入的所有 Promsie 都是 fulfilled，则返回由他们的值组成的，状态为 fulfilled 的新 Promise；
只要有一个 Promise 是 rejected，则返回 rejected 状态的新 Promsie，且它的值是第一个 rejected 的 Promise 的值；
只要有一个 Promise 是 pending，则返回一个 pending 状态的新 Promise；

```js
Promise.all = function (promiseArr) {
  let index = 0,
    result = [];
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          index++;
          result[i] = val;
          if (index === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
```

# Promise.race

Promise.race 会返回一个由所有可迭代实例中第一个 fulfilled 或 rejected 的实例包装后的新实例。

```js
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          rejecte(err);
        }
      );
    });
  });
};
```

# Promise.allSettled

Promise.allSettled 的规则是这样：

所有 Promise 的状态都变化了，那么新返回一个状态是 fulfilled 的 Promise，且它的值是一个数组，数组的每项由所有 Promise 的值和状态组成的对象；
如果有一个是 pending 的 Promise，则返回一个状态是 pending 的新实例；

```js
Promise.allSettled = function (promiseArr) {
  let result = [];

  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          result.push({
            status: "fulfilled",
            value: val,
          });
          if (result.length === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          result.push({
            status: "rejected",
            reason: err,
          });
          if (result.length === promiseArr.length) {
            resolve(result);
          }
        }
      );
    });
  });
};
```

# Promise.any

Promise.any 的规则是这样：

空数组或者所有 Promise 都是 rejected，则返回状态是 rejected 的新 Promsie，且值为 AggregateError 的错误；
只要有一个是 fulfilled 状态的，则返回第一个是 fulfilled 的新实例；
其他情况都会返回一个 pending 的新实例；

```js
Promise.any = function (promiseArr) {
  let index = 0;
  return new Promise((resolve, reject) => {
    if (promiseArr.length === 0) return;
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          index++;
          if (index === promiseArr.length) {
            reject(new AggregateError("All promises were rejected"));
          }
        }
      );
    });
  });
};
```

# 异步并发数限制

/\*\*

- 关键点
- 1.  new promise 一经创建，立即执行
- 2.  使用 Promise.resolve().then 可以把任务加到微任务队列，防止立即执行迭代方法
- 3.  微任务处理过程中，产生的新的微任务，会在同一事件循环内，追加到微任务队列里
- 4.  使用 race 在某个任务完成时，继续添加任务，保持任务按照最大并发数进行执行
- 5.  任务完成后，需要从 doingTasks 中移出
      \*/

```js
function limit(count, array, iterateFunc) {
  const tasks = [];
  const doingTasks = [];
  let i = 0;
  const enqueue = () => {
    if (i === array.length) {
      return Promise.resolve();
    }
    const task = Promise.resolve().then(() => iterateFunc(array[i++]));
    tasks.push(task);
    const doing = task.then(() =>
      doingTasks.splice(doingTasks.indexOf(doing), 1)
    );
    doingTasks.push(doing);
    const res =
      doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve();
    return res.then(enqueue);
  };
  return enqueue().then(() => Promise.all(tasks));
}

// test
const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));
limit(2, [1000, 1000, 1000, 1000], timeout).then((res) => {
  console.log(res);
});
```

# 异步串行 | 异步并行

```js
// 字节面试题，实现一个异步加法
function asyncAdd(a, b, callback) {
  setTimeout(function () {
    callback(null, a + b);
  }, 500);
}

// 解决方案
// 1. promisify
const promiseAdd = (a, b) =>
  new Promise((resolve, reject) => {
    asyncAdd(a, b, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

// 2. 串行处理
async function serialSum(...args) {
  return args.reduce(
    (task, now) => task.then((res) => promiseAdd(res, now)),
    Promise.resolve(0)
  );
}

// 3. 并行处理
async function parallelSum(...args) {
  if (args.length === 1) return args[0];
  const tasks = [];
  for (let i = 0; i < args.length; i += 2) {
    tasks.push(promiseAdd(args[i], args[i + 1] || 0));
  }
  const results = await Promise.all(tasks);
  return parallelSum(...results);
}

// 测试
(async () => {
  console.log("Running...");
  const res1 = await serialSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12);
  console.log(res1);
  const res2 = await parallelSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12);
  console.log(res2);
  console.log("Done");
})();
```

# vue reactive

```js
// Dep module
class Dep {
  static stack = [];
  static target = null;
  deps = null;

  constructor() {
    this.deps = new Set();
  }

  depend() {
    if (Dep.target) {
      this.deps.add(Dep.target);
    }
  }

  notify() {
    this.deps.forEach((w) => w.update());
  }

  static pushTarget(t) {
    if (this.target) {
      this.stack.push(this.target);
    }
    this.target = t;
  }

  static popTarget() {
    this.target = this.stack.pop();
  }
}

// reactive
function reactive(o) {
  if (o && typeof o === "object") {
    Object.keys(o).forEach((k) => {
      defineReactive(o, k, o[k]);
    });
  }
  return o;
}

function defineReactive(obj, k, val) {
  let dep = new Dep();
  Object.defineProperty(obj, k, {
    get() {
      dep.depend();
      return val;
    },
    set(newVal) {
      val = newVal;
      dep.notify();
    },
  });
  if (val && typeof val === "object") {
    reactive(val);
  }
}

// watcher
class Watcher {
  constructor(effect) {
    this.effect = effect;
    this.update();
  }

  update() {
    Dep.pushTarget(this);
    this.value = this.effect();
    Dep.popTarget();
    return this.value;
  }
}

// 测试代码
const data = reactive({
  msg: "aaa",
});

new Watcher(() => {
  console.log("===> effect", data.msg);
});

setTimeout(() => {
  data.msg = "hello";
}, 1000);
```

        拦截 set，所有赋值都在 copy （原数据浅拷贝的对象）中进行，这样就不会影响到原对象
        拦截 get，通过属性是否修改的逻辑分别从 copy 或者原数据中取值
        最后生成不可变对象的时候遍历原对象，判断属性是否被修改过，也就是判断是否存在 copy。如果没有修改过的话，就返回原属性，并且也不再需要对子属性对象遍历，提高了性能。如果修改过的话，就需要把 copy 赋值到新对象上，并且递归遍历

接下来是实现，我们既然要用 Proxy 实现，那么肯定得生成一个 Proxy 对象，因此我们首先来实现一个生成 Proxy 对象的函数。

```js
// 用于判断是否为 proxy 对象
const isProxy = (value) => !!value && !!value[MY_IMMER];
// 存放生成的 proxy 对象
const proxies = new Map();
const getProxy = (data) => {
  if (isProxy(data)) {
    return data;
  }
  if (isPlainObject(data) || Array.isArray(data)) {
    if (proxies.has(data)) {
      return proxies.get(data);
    }
    const proxy = new Proxy(data, objectTraps);
    proxies.set(data, proxy);
    return proxy;
  }
  return data;
};
```

首先我们需要判断传入的属性是不是已经为一个 proxy 对象，已经是的话直接返回即可。这里判断的核心是通过 value[MY_IMMER]，因为只有当是 proxy 对象以后才会触发我们自定义的拦截 get 函数，在拦截函数中判断如果 key 是 MY_IMMER 的话就返回 target
接下来我们需要判断参数是否是一个正常 Object 构造出来的对象或数组，isPlainObject 网上有很多实现，这里就不贴代码了，有兴趣的可以在文末阅读源码
最后我们需要判断相应的 proxy 是否已经创建过，创建过的话直接从 Map 中拿即可，否则就新创建一个。注意这里用于存放 proxy 对象的容器是 Map 而不是一个普通对象，这是因为如果用普通对象存放的话，在取值的时候会出现爆栈，具体原因大家可以自行思考 🤔

    拦截 get 的时候首先需要判断 key 是不是 MY_IMMER，是的话说明这时候被访问的对象是个 proxy，我们需要把正确的 target 返回出去。然后就是正常返回值了，如果存在 copy 就返回 copy，否则返回原数据
    拦截 set 的时候第一步肯定是生成一个 copy，因为赋值操作我们都需要在 copy 上进行，否则会影响原数据。然后在 copy 中赋值时不能把 proxy 对象赋值进去，否则最后生成的不可变对象内部会内存 proxy 对象，所以这里我们需要判断下是否为 proxy 对象
    创建 copy 的逻辑很简单，就是判断数据的类型然后进行浅拷贝操作

```js
// 注意这里还是用到了 Map，原理和上文说的一致
const copies = new Map();
const objectTraps = {
  get(target, key) {
    if (key === MY_IMMER) return target;
    const data = copies.get(target) || target;
    return getProxy(data[key]);
  },
  set(target, key, val) {
    const copy = getCopy(target);
    const newValue = getProxy(val);
    // 这里的判断用于拿 proxy 的 target
    // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
    copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue;
    return true;
  },
};
const getCopy = (data) => {
  if (copies.has(data)) {
    return copies.get(data);
  }
  const copy = Array.isArray(data) ? data.slice() : { ...data };
  copies.set(data, copy);
  return copy;
};
```

这里的逻辑上文其实已经说过了，就是判断传入的参数是否被修改过。没有修改过的话就直接返回原数据并且停止这个分支的遍历，如果修改过的话就从 copy 中取值，然后把整个 copy 中的属性都执行一遍 finalize 函数。

```js
const MY_IMMER = Symbol("my-immer1");

const isPlainObject = (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    {}.toString.call(value) != "[object Object]"
  ) {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor == "function" &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  );
};

const isProxy = (value) => !!value && !!value[MY_IMMER];

function produce(baseState, fn) {
  const proxies = new Map();
  const copies = new Map();

  const objectTraps = {
    get(target, key) {
      if (key === MY_IMMER) return target;
      const data = copies.get(target) || target;
      return getProxy(data[key]);
    },
    set(target, key, val) {
      const copy = getCopy(target);
      const newValue = getProxy(val);
      // 这里的判断用于拿 proxy 的 target
      // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
      copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue;
      return true;
    },
  };

  const getProxy = (data) => {
    if (isProxy(data)) {
      return data;
    }
    if (isPlainObject(data) || Array.isArray(data)) {
      if (proxies.has(data)) {
        return proxies.get(data);
      }
      const proxy = new Proxy(data, objectTraps);
      proxies.set(data, proxy);
      return proxy;
    }
    return data;
  };

  const getCopy = (data) => {
    if (copies.has(data)) {
      return copies.get(data);
    }
    const copy = Array.isArray(data) ? data.slice() : { ...data };
    copies.set(data, copy);
    return copy;
  };

  const isChange = (data) => {
    if (proxies.has(data) || copies.has(data)) return true;
  };

  const finalize = (data) => {
    if (isPlainObject(data) || Array.isArray(data)) {
      if (!isChange(data)) {
        return data;
      }
      const copy = getCopy(data);
      Object.keys(copy).forEach((key) => {
        copy[key] = finalize(copy[key]);
      });
      return copy;
    }
    return data;
  };

  const proxy = getProxy(baseState);
  fn(proxy);
  return finalize(baseState);
}

const state = {
  info: {
    name: "yck",
    career: {
      first: {
        name: "111",
      },
    },
  },
  data: [1],
};

const data = produce(state, (draftState) => {
  draftState.info.age = 26;
  draftState.info.career.first.name = "222";
});

console.log(data, state);
console.log(data.data === state.data);
```

# const

```js
      var __const = function __const (data, value) {
        window.data = value // 把要定义的data挂载到window下，并赋值value
        Object.defineProperty(window, data, { // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
          enumerable: false,
          configurable: false,
          get: function () {
            return value
          },
          set: function (data) {
            if (data !== value) { // 当要对当前属性进行赋值时，则抛出错误！
              throw new TypeError('Assignment to constant variable.')
            } else {
              return value
            }
          }
        })
      }
      __const('a', 10)
      console.log(a)
      delete a
      console.log(a)
      for (let item in window) { // 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
        if (item === 'a') { // 因为不可枚举，所以不执行
          console.log(window[item])
        }
      }
      a = 20 // 报错

```
