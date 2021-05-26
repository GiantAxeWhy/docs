### js 永不休

# 1.介绍一下 js 的数据类型有哪些，值是如何存储的， null 和 undefined 的区别？

      一共有七个基本数据类型：number、string、undefined、null、boollen、symbol、bigint
      一个基本引用类型：object

其中原始数据类型是直接储存在栈中 ,占据空间小，大小固定，使用频繁，
引用数据类型放在堆和栈中，占据空间大，大小不固定，引用数据类型在栈中存放了指针指向该实体的实际存放地址。
当解释器实际寻找引用值时，检索其栈中的地址，取得地址获得实体

首先 Undefined 和 Null 都是基本数据类型，这两个基本数据类型分别都只有一个值，就是 undefined 和 null。
undefined 代表的含义是未定义，
null 代表的含义是空对象（其实不是真的对象，请看下面的注意！）。一般变量声明了但还没有定义的时候会返回 undefined，null
主要用于赋值给一些可能会返回对象的变量，作为初始化。
其实 null 不是对象，虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

# 2.JS 中判断类型 typeof，instanceof，constructor，Object.prototype.toString.call()

    typeof对于原始类型来说，除了 null 都可以显示正确的类型，typeof 对于对象来说，除了函数都会显示 object，所以说 typeof 并不能准确判断变量到底是什么类型,所以想判断一个对象的正确类型，这时候可以考虑使用 instanceof

    instanceof内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。可以看出直接的字面量值判断数据类型，instanceof可以精准判断引用数据类型（Array，Function，Object），而基本数据类型不能被instanceof精准判断。

```js
console.log((2).constructor === Number); // true
console.log(true.constructor === Boolean); // true
console.log("str".constructor === String); // true
console.log([].constructor === Array); // true
console.log(function () {}.constructor === Function); // true
console.log({}.constructor === Object); // true

//这里有一个坑，如果我创建一个对象，更改它的原型，constructor就会变得不可靠了
function Fn() {}

Fn.prototype = new Array();

var f = new Fn();

console.log(f.constructor === Fn); // false
console.log(f.constructor === Array); // true
```

Object.prototype.toString.call()使用 Object 对象的原型方法 toString ，使用 call 进行狸猫换太子，借用 Object 的 toString 方法

# 3.js 中的内置对象

全局的对象（ global objects ）或称标准内置对象，不要和 "全局对象（global object）" 混淆。这里说的全局的对象是说在
全局作用域里的对象。全局作用域中的其他对象可以由用户的脚本创建或由宿主程序提供。

标准内置对象的分类

（1）值属性，这些全局属性返回一个简单值，这些值没有自己的属性和方法。

例如 Infinity、NaN、undefined、null 字面量

（2）函数属性，全局函数可以直接调用，不需要在调用时指定所属对象，执行结束后会将结果直接返回给调用者。

例如 eval()、parseFloat()、parseInt() 等

（3）基本对象，基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。

例如 Object、Function、Boolean、Symbol、Error 等

（4）数字和日期对象，用来表示数字、日期和执行数学计算的对象。

例如 Number、Math、Date

（5）字符串，用来表示和操作字符串的对象。

例如 String、RegExp

（6）可索引的集合对象，这些对象表示按照索引值来排序的数据集合，包括数组和类型数组，以及类数组结构的对象。例如 Array

（7）使用键的集合对象，这些集合对象在存储数据时会使用到键，支持按照插入顺序来迭代元素。

例如 Map、Set、WeakMap、WeakSet

（8）矢量集合，SIMD 矢量集合中的数据会被组织为一个数据序列。

例如 SIMD 等

（9）结构化数据，这些对象用来表示和操作结构化的缓冲区数据，或使用 JSON 编码的数据。

例如 JSON 等

（10）控制抽象对象

例如 Promise、Generator 等

（11）反射

例如 Reflect、Proxy

（12）国际化，为了支持多语言处理而加入 ECMAScript 的对象。

例如 Intl、Intl.Collator 等

（13）WebAssembly

（14）其他

例如 arguments

# 4.Javascript 的作用域和作用域链

作用域：作用域是定义变量的区域，它有一套访问变量的规则，这套规则来管理浏览器引擎如何在当前作用域以及嵌套的作用域中根据变量（标识符）进行变量查找。
作用域链：保证对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，我们可以访问到外层环境的变量和 函数。
作用域链的本质上是一个指向变量对象的指针列表。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的前 端始终都是当前执行上下文的变量对象。全局执行上下文的变量对象（也就是全局对象）始终是作用域链的最后一个对象。

# 5.js 创建对象的几种方式

我们一般使用字面量的形式直接创建对象，但是这种创建方式对于创建大量相似对象的时候，会产生大量的重复代码。但 js
和一般的面向对象的语言不同，在 ES6 之前它没有类的概念。但是我们可以使用函数来进行模拟，从而产生出可复用的对象
创建方式，我了解到的方式有这么几种：

（1）第一种是工厂模式，工厂模式的主要工作原理是用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。但是它有一个很大的问题就是创建出来的对象无法和某个类型联系起来，它只是简单的封装了复用代码，而没有建立起对象和类型间的关系。

（2）第二种是构造函数模式。js 中每一个函数都可以作为构造函数，只要一个函数是通过 new 来调用的，那么我们就可以把它称为构造函数。执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的 prototype 属性，然后将执行上下文中的 this 指向这个对象，最后再执行整个函数，如果返回值不是对象，则返回新建的对象。因为 this 的值指向了新建的对象，因此我们可以使用 this 给对象赋值。构造函数模式相对于工厂模式的优点是，所创建的对象和构造函数建立起了联系，因此我们可以通过原型来识别对象的类型。但是构造函数存在一个缺点就是，造成了不必要的函数对象的创建，因为在 js 中函数也是一个对象，因此如果对象属性中如果包含函数的话，那么每次我们都会新建一个函数对象，浪费了不必要的内存空间，因为函数是所有的实例都可以通用的。

（3）第三种模式是原型模式，因为每一个函数都有一个 prototype 属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此我们可以使用原型对象来添加公用属性和方法，从而实现代码的复用。这种方式相对于构造函数模式来说，解决了函数对象的复用问题。但是这种模式也存在一些问题，一个是没有办法通过传入参数来初始化值，另一个是如果存在一个引用类型如 Array 这样的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例。

（4）第四种模式是组合使用构造函数模式和原型模式，这是创建自定义类型的最常见方式。因为构造函数模式和原型模式分开使用都存在一些问题，因此我们可以组合使用这两种模式，通过构造函数来初始化对象的属性，通过原型对象来实现函数方法的复用。这种方法很好的解决了两种模式单独使用时的缺点，但是有一点不足的就是，因为使用了两种不同的模式，所以对于代码的封装性不够好。

（5）第五种模式是动态原型模式，这一种模式将原型方法赋值的创建过程移动到了构造函数的内部，通过对属性是否存在的判断，可以实现仅在第一次调用函数时对原型对象赋值一次的效果。这一种方式很好地对上面的混合模式进行了封装。

（6）第六种模式是寄生构造函数模式，这一种模式和工厂模式的实现基本相同，我对这个模式的理解是，它主要是基于一个已有的类型，在实例化时对实例化的对象进行扩展。这样既不用修改原来的构造函数，也达到了扩展对象的目的。它的一个缺点和工厂模式一样，无法实现对象的识别。

# 6.实现继承的几种方式以及如何实现寄生式组合继承

我了解的 js 中实现继承的几种方式有：

（1）第一种是以原型链的方式来实现继承，但是这种实现方式存在的缺点是，在包含有引用类型的数据时，会被所有的实例对象所共享，容易造成修改的混乱。还有就是在创建子类型的时候不能向超类型传递参数。

（2）第二种方式是使用借用构造函数的方式，这种方式是通过在子类型的函数中调用超类型的构造函数来实现的，这一种方法解决了不能向超类型传递参数的缺点，但是它存在的一个问题就是无法实现函数方法的复用，并且超类型原型定义的方法子类型也没有办法访问到。

（3）第三种方式是组合继承，组合继承是将原型链和借用构造函数组合起来使用的一种方式。通过借用构造函数的方式来实现类型的属性的继承，通过将子类型的原型设置为超类型的实例来实现方法的继承。这种方式解决了上面的两种模式单独使用时的问题，但是由于我们是以超类型的实例来作为子类型的原型，所以调用了两次超类的构造函数，造成了子类型的原型中多了很多不必要的属性。

（4）第四种方式是原型式继承，原型式继承的主要思路就是基于已有的对象来创建新的对象，实现的原理是，向函数中传入一个对象，然后返回一个以这个对象为原型的对象。这种继承的思路主要不是为了实现创造一种新的类型，只是对某个对象实现一种简单继承，ES5 中定义的 Object.create() 方法就是原型式继承的实现。缺点与原型链方式相同。

（5）第五种方式是寄生式继承，寄生式继承的思路是创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象的副本，然后对象进行扩展，最后返回这个对象。这个扩展的过程就可以理解是一种继承。这种继承的优点就是对一个简单对象实现继承，如果这个对象不是我们的自定义类型时。缺点是没有办法实现函数的复用。

（6）第六种方式是寄生式组合继承，组合继承的缺点就是使用超类型的实例做为子类型的原型，导致添加了不必要的原型属性。寄生式组合继承的方式是使用超类型的原型的副本来作为子类型的原型，这样就避免了创建不必要的属性。

寄生式组合继承

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  console.log("My name is " + this.name + ".");
};

function Student(name, grade) {
  Person.call(this, name);
  this.grade = grade;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.sayMyGrade = function () {
  console.log("My grade is " + this.grade + ".");
};
```

# 7.谈谈你对 this、call、apply 和 bind 的理解

this 设计的初衷是在函数内部使用，用来指代当前的运行环境。为什么这么说呢？
JavaScript 中的对象的赋值行为是将地址赋给一个变量，引擎在读取变量的时候其实就是要了个地址然后再从原始地址中读取对象。而 JavaScript 允许函数体内部引用当前环境的其他变量，而这个变量是由运行环境提供的。由于函数又可以在不同的运行环境执行（如全局作用域内执行，对象内执行...），所以需要一个机制来表明代码到底在哪里执行！于是 this 出现了，它的设计目的就是在函数体内部，指代函数当前的运行环境。

global this
在浏览器里，在全局范围内：

1、this 等价于 window 对象；
2、用 var 声明一个变量和给 this 或者 window 添加属性是等价的；
3、如果你在声明一个变量的时候没有使用 var 或者 let、const(es6),你就是在给全局的 this 添加或者改变属性值。

function this
对于函数中的 this 的指向问题，有一句话很好用：运行时 this 永远指向最后调用它的那个对象。

举一个栗子

```js
var name = "windowsName";
function sayName() {
  var name = "Jake";
  console.log(this.name); // windowsName
  console.log(this); // Window
}
sayName();
console.log(this); // Window
```

我们看最后调用 sayName 的地方 sayName();，前面没有调用的对象那么就是全局对象 window，这就相当于是 window.sayName()。

```js
function foo() {
  console.log(this.age);
}

var obj1 = {
  age: 23,
  foo: foo,
};

var obj2 = {
  age: 18,
  obj1: obj1,
};

obj2.obj1.foo(); // 23
```

还是开头的那句话，最后调用 foo()的是 obj1，所以 this 指向 obj1，输出 23。

构造函数中的 this
所谓构造函数，就是通过这个函数生成一个新对象（object）。当一个函数作为构造器使用时(通过 new 关键字), 它的 this 值绑定到新创建的那个对象。如果没使用 new 关键字, 那么他就只是一个普通的函数, this 将指向 window 对象。

```js
var a = new Foo("zhang","jake");

new Foo{
    var obj = {};
    obj.__proto__ = Foo.prototype;
    var result = Foo.call(obj,"zhang","jake");
    return typeof result === 'obj'? result : obj;
}

```

若执行 new Foo()，过程如下：
1）创建新对象 obj；
2）给新对象的内部属性赋值，构造原型链（将新对象的隐式原型指向其构造函数的显示原型）；
3）执行函数 Foo，执行过程中内部 this 指向新创建的对象 obj（这里使用了 call 改变 this 指向）；
4）如果 Foo 内部显式返回对象类型数据，则返回该数据，执行结束；否则返回新创建的对象 obj。

```js
var name = "Jake";
jiuzhixiang;
function testThis() {
  this.name = "jakezhang";
  this.sayName = function () {
    return this.name;
  };
}
console.log(this.name); // Jake

new testThis();
console.log(this.name); // Jake

var result = new testThis();
console.log(result.name); // jakezhang
console.log(result.sayName()); // jakezhang

testThis();
console.log(this.name); // jakezhang
```

class 中的 this
在 es6 中，类，是 JavaScript 应用程序中非常重要的一个部分。类通常包含一个 constructor ， this 可以指向任何新创建的对象。
不过在作为方法时，如果该方法作为普通函数被调用， this 也可以指向任何其他值。与方法一样，类也可能失去对接收器的跟踪。

```js
class Hero {
  constructor(heroName) {
    this.heroName = heroName;
  }
  dialogue() {
    console.log(`I am ${this.heroName}`);
  }
}
const batman = new Hero("Batman");
batman.dialogue();
```

构造函数里的 this 指向新创建的 类实例。当我们调用 batman.dialogue()时， dialogue()作为方法被调用， batman 是它的接收器。
但是如果我们将 dialogue()方法的引用存储起来，并稍后将其作为函数调用，我们会丢失该方法的接收器，此时 this 参数指向 undefined 。

```js
const say = batman.dialogue;
say();
```

出现错误的原因是 JavaScript 类是隐式的运行在严格模式下的。我们是在没有任何自动绑定的情况下调用 say()函数的。要解决这个问题，我们需要手动使用 bind()将 dialogue()函数与 batman 绑定在一起。

```js
const say = batman.dialogue.bind(batman);
say();
```

箭头函数中的 this
es5 中的 this 要看函数在什么地方调用（即要看运行时），通过谁是最后调用它该函数的对象来判断 this 指向。但 es6 的箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。箭头函数的 this 始终指向函数定义时的 this，而非执行时。

```js
let name = "zjk";

let o = {
  name: "Jake",

  sayName: function () {
    console.log(this.name);
  },

  func: function () {
    setTimeout(() => {
      this.sayName();
    }, 100);
  },
};

o.func(); // Jake
```

使用 call 、 apply 或 bind 等方法给 this 传值，箭头函数会忽略。箭头函数引用的是箭头函数在创建时设置的 this 值。

call & apply

```js
var name = "zjk";
function fun() {
  console.log(this.name);
}

var obj = {
  name: "jake",
};
fun(); // zjk
fun.call(obj); //Jake
```

每个函数都包含两个非继承而来的方法：apply()和 call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 this 对象的值。
apply()
apply()方法接收两个参数：一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是 Array 的实例，也可以是 arguments 对象。

```js
function sum(num1, num2) {
  return num1 + num2;
}
function callSum1(num1, num2) {
  return sum.apply(this, arguments); // 传入 arguments 对象
}
function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]); // 传入数组
}
console.log(callSum1(10, 10)); //20
console.log(callSum2(10, 10)); //20
```

call()
call()方法与 apply()方法的作用相同，它们的唯一区别在于接收参数的方式不同。在使用 call()方法时，传递给函数的参数必须逐个列举出来。

```js
function sum(num1, num2) {
  return num1 + num2;
}
function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}
console.log(callSum(10, 10)); //20
```

call()方法与 apply()方法返回的结果是完全相同的，至于是使用 apply()还是 call()，完全取决于你采取哪种给函数传递参数的方式最方便。

参数数量/顺序确定就用 call，参数数量/顺序不确定的话就用 apply。
考虑可读性：参数数量不多就用 call，参数数量比较多的话，把参数整合成数组，使用 apply。
bind()
bind()方法会创建一个函数的实例，其 this 值会被绑定到传给 bind()函数的值。意思就是 bind() 会返回一个新函数。例如：

```js
window.color = "red";
var o = { color: "blue" };
function sayColor() {
  alert(this.color);
}
var objectSayColor = sayColor.bind(o);
objectSayColor(); //blue
```

call/apply 与 bind 的区别
执行：

call/apply 改变了函数的 this 上下文后马上执行该函数
bind 则是返回改变了上下文后的函数,不执行该函数

```js
function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

add.bind(sub, 5, 3); // 这时，并不会返回 8
add.bind(sub, 5, 3)(); // 调用后，返回 8
```

返回值:

call/apply 返回 fun 的执行结果
bind 返回 fun 的拷贝，并指定了 fun 的 this 指向，保存了 fun 的参数。

从上面几个简单的例子可以看出 call/apply/bind 是在向其他对象借用方法，这也符合我们的正常思维，举个简单的栗子。
我和我高中一个同学玩的超级好，衣服鞋子都是共穿的，去买衣服的时候，他买衣服，我买鞋子；回来后某天我想穿他买的衣服了，但是我没有，于是我就借用他的穿。这样我就既达到了穿新衣服的目的，又节省了 money~
A 对象有个方法，B 对象因为某种原因也需要用到同样的方法，这时候就可以让 B 借用 A 对象的方法啦，既达到了目的，又节省了内存。
这就是 call/apply/bind 的核心理念：借。

手写实现 apply、call、bind
apply
1、先给 Function 原型上扩展个方法并接收 2 个参数,

```js
Function.prototype.myApply = function (context, args) {};
```

2、因为不传 context 的话,this 会指向 window,所以这里将 context 和 args 做一下容错处理

```js
Function.prototype.myApply = function (context, args) {
  // 处理容错
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
};
```

3、使用隐式绑定去实现显式绑定

```js
Function.prototype.myApply = function (context, args) {
  // 处理容错
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  context[key](...args);
};
```

4、最后一步要返回函数调用的返回值,并且把 context 上的属性删了才不会造成影响

```js
Function.prototype.myApply = function (context, args) {
  // 处理容错
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  const result = context[key](...args);
  //删除添加的属性
  delete context[key];
  //返回函数调用的返回值
  return result;
};
```

验证

```js
function fun(...args) {
  console.log(this.name, ...args);
}
const result = {
  name: "Jake",
};
// 参数为数组;方法立即执行
fun.myApply(result, [1, 2]);
```

call

```js
//传递参数从一个数组变成逐个传参了,不用...扩展运算符的也可以用arguments代替
Function.prototype.NealCall = function (context, ...args) {
  //这里默认不传就是给window,也可以用es6给参数设置默认参数
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  const result = context[key](...args);
  //删除添加的属性
  delete context[key];
  //返回函数调用的返回值
  return result;
};
```

bind
bind 的实现要稍微麻烦一点，因为 bind 是返回一个绑定好的函数,apply 是直接调用.但其实简单来说就是返回一个函数,里面执行了 apply 上述的操作而已.不过有一个需要判断的点,因为返回新的函数,要考虑到使用 new 去调用,并且 new 的优先级比较高,所以需要判断 new 的调用,还有一个特点就是 bind 调用的时候可以传参,调用之后生成的新的函数也可以传参,效果是一样的,所以这一块也要做处理。

```js
Function.prototype.myBind = function (objThis, ...params) {
  const thisFn = this; // 存储源函数以及上方的params(函数参数)
  // 对返回的函数 secondParams 二次传参
  let fToBind = function (...secondParams) {
    const isNew = this instanceof fToBind; // this是否是fToBind的实例 也就是返回的fToBind是否通过new调用
    const context = isNew ? this : Object(objThis); // new调用就绑定到this上,否则就绑定到传入的objThis上
    return thisFn.call(context, ...params, ...secondParams); // 用call调用源函数绑定this的指向并传递参数,返回执行结果
  };
  if (thisFn.prototype) {
    // 复制源函数的prototype给fToBind 一些情况下函数没有prototype，比如箭头函数
    fToBind.prototype = Object.create(thisFn.prototype);
  }
  return fToBind; // 返回拷贝的函数
};
```

      总结
      在浏览器里，在全局范围内 this 指向 window 对象；
      在函数中，this 永远指向最后调用他的那个对象；
      构造函数中，this 指向 new 出来的那个新的对象；
      call、apply、bind 中的 this 被强绑定在指定的那个对象上；
      箭头函数中 this 比较特殊,箭头函数 this 为父作用域的 this，不是调用时的 this.要知道前四种方式,都是调用时确定,也就是动态的,而箭头函数的 this 指向是静态的,声明的时候就确定了下来；
      apply、call、bind 都是 js 给函数内置的一些 API，调用他们可以为函数指定 this 的执行,同时也可以传参。

# 8.JavaScript 原型，原型链？ 有什么特点？

在 js 中我们是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个 prototype 属性值，这个属性值是一个对
象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法。当我们使用构造函数新建一个对象后，在这个对象的内部
将包含一个指针，这个指针指向构造函数的 prototype 属性对应的值，在 ES5 中这个指针被称为对象的原型。一般来说我们
是不应该能够获取到这个值的，但是现在浏览器中都实现了 proto 属性来让我们访问这个属性，但是我们最好不要使用这
个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，我们可以通过这个方法来获取对
象的原型。
当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又
会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype 所以这就
是我们新建的对象为什么能够使用 toString() 等方法的原因。
特点：
JavaScript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与
之相关的对象也会继承这一改变。
可以参考

[原型与原型链](prototype)

js 获取原型的方法
p.proto
p.constructor.prototype
Object.getPrototypeOf(p)

# 9.什么是闭包，为什么要用它？

闭包是指有权访问另一个函数作用域内变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以
访问到当前函数的局部变量。
闭包有两个常用的用途。

闭包的第一个用途是使我们在函数外部能够访问到函数内部的变量。通过使用闭包，我们可以通过在外部调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。
函数的另一个用途是使已经运行结束的函数上下文中的变量对象继续留在内存中，因为闭包函数保留了这个变量对象的引用，所以这个变量对象不会被回收。
其实闭包的本质就是作用域链的一个特殊的应用，只要了解了作用域链的创建过程，就能够理解闭包的实现原理。
