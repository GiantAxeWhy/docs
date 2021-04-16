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
