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
