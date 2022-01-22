# React 概述

> 官网：https://react.docschina.org/

## 什么是 React？

React 是由**Facebook**研发的、用于**解决 UI 复杂度**的开源**JavaScript 库**，目前由 React 联合社区维护。

> 它不是框架，只是为了解决 UI 复杂度而诞生的一个库

## React 的特点

- 轻量：React 的开发版所有源码（包含注释）仅 3000 多行
- 原生：所有的 React 的代码都是用原生 JS 书写而成的，不依赖其他任何库
- 易扩展：React 对代码的封装程度较低，也没有过多的使用魔法，所以 React 中的很多功能都可以扩展。
- 不依赖宿主环境：React 只依赖原生 JS 语言，不依赖任何其他东西，包括运行环境。因此，它可以被轻松的移植到浏览器、桌面应用、移动端。
- 渐近式：React 并非框架，对整个工程没有强制约束力。这对与那些已存在的工程，可以逐步的将其改造为 React，而不需要全盘重写。
- 单向数据流：所有的数据自顶而下的流动
- 用 JS 代码声明界面
- 组件化

## 对比 Vue

|   对比项   | Vue | React |
| :--------: | :-: | :---: |
| 全球使用量 |     |   ✔   |
| 国内使用量 |  ✔  |       |
|    性能    |  ✔  |   ✔   |
|   易上手   |  ✔  |       |
|   灵活度   |     |   ✔   |
|    生态    |     |   ✔   |

## 学习路径

整体原则：熟悉 API --> 深入理解原理

1. React

   1. 核心：jsx、组件以及属性、组件状态、事件、setstate、生命周期、传递元素、表单
   2. 进阶：默认属性、HOC、ref、pureComponent、了解渲染过程、router 源码
   3. 生态：HOOK、router、redux、umi、adtD

2. React-Router：相当于 vue-router
3. Redux：相当于 Vuex
   1. Redux 本身
   2. 各种中间件
4. 第三方脚手架：umi
5. UI 库：Ant Design，相当于 Vue 的 Element-UI 或 IView
6. 源码部分
   1. React 源码分析
   2. Redux 源码分析

# jsx

## 什么是 JSX

- Facebook 起草的 JS 扩展语法
- 本质是一个 JS 对象，会被 babel 编译，最终会被转换为 React.createElement
- 每个 JSX 表达式，有且仅有一个根节点
  - React.Fragment
- 每个 JSX 元素必须结束（XML 规范）

```js
const h1 = (
  <h1>
    Hello world
    <span>1231</span>
  </h1>
);

ReactDOM.render(h1, document.getElementById("root"));

React.createElement(
  "h1",
  {},
  "hello world",
  React.createElement("span", {}, "span元素")
);
```

```js
const img = (
  <img
    src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2962719555,3613138778&fm=27&gp=0.jpg"
    alt=""
  />
);

ReactDOM.render(img, document.getElementById("root"));
```

## 在 JSX 中嵌入表达式

```js
const a = 1234,
  b = 4321;
const div = (
  <div>
    {a}*{b} = {a * b}
  </div>
);
ReactDOM.render(div, document.getElementById("root"));
const div = React.createElement("div", {}, `${a} * ${b} = ${a * b}`);

// 普通对象
//const obj = {
//     a: 1,
//     b: 2
// }
//元素对象
//const obj = <span>这是一个span元素</span>;
//数组
//遍历数组每一个元素放进来
//const arr = [2, null, false, undefined, 3,{a:1,b:2}];
```

- 在 JSX 中使用注释
- 将表达式作为内容的一部分
  - null、undefined、false 不会显示
  - 普通对象，不可以作为子元素
  - 可以放置 React 元素对象
- 将表达式作为元素属性

```js
const url =
  "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2962719555,3613138778&fm=27&gp=0.jpg";
const cls = "image";
const div = (
  <div>
    <img
      src={url}
      className={cls}
      style={{
        marginLeft: "50px",
        width: "200px",
      }}
      alt=""
    />
  </div>
);

ReactDOM.render(div, document.getElementById("root"));
```

- 属性使用小驼峰命名法
- 防止注入攻击
  - 自动编码
  - dangerouslySetInnerHTML

```js
const content = "<h1>afasfasfd</h1><p>阿斯顿法定发送</p>";
const div = (
  <div
    dangerouslySetInnerHTML={{
      __html: content,
    }}
  ></div>
);

ReactDOM.render(div, document.getElementById("root"));
```

## 元素的不可变性

- 虽然 JSX 元素是一个对象，但是该对象中的所有属性不可更改
- 如果确实需要更改元素的属性，需要重新创建 JSX 元素

```js
let num = 0;

setInterval(() => {
  num++;
  const div = <div title="asdfadf">{num}</div>;
  ReactDOM.render(div, document.getElementById("root"));
}, 1000);
```

效率？

# 组件和组件属性

组件：包含内容、样式和功能的 UI 单元

## 创建一个组件

**特别注意：组件的名称首字母必须大写**

1. 函数组件

返回一个 React 元素

```js
export default function MyFuncComp(props) {
  // return <h1>函数组件的内容</h1>
  //组件结构
  return <h1>函数组件，目前的数字：{props.number}</h1>;
}

//ReactDOM.render(<div>{MyFuncComp}</div>,document.getElementById("root"))

ReactDOM.render(
  <div>
    <MyFuncComp></MyFuncComp>
  </div>,
  document.getElementById("root")
);

//react组件小写会认为是普通的html元素
const comp =<MyFuncComp> //使用组件生成的，仍然是React元素，变化的是type
ReactDOM.render(
  <div>
   {comp}
  </div>,
  document.getElementById("root")
);
```

2. 类组件

必须继承 React.Component

必须提供 render 函数，用于渲染组件

## 组件的属性

1. 对于函数组件，属性会作为一个对象的属性，传递给函数的参数
2. 对于类组件，属性会作为一个对象的属性，传递给构造函数的参数

注意：组件的属性，应该使用小驼峰命名法

```js
import React from "react";

export default class MyClassComp extends React.Component {
  // constructor(props) {
  //     super(props); // this.props = props;
  //     console.log(props, this.props, props === this.props);
  // }

  /**
   * 该方法必须返回React元素
   */
  render() {
    if (this.props.obj) {
      return (
        <>
          <p>姓名：{this.props.obj.name}</p>
          <p>年龄：{this.props.obj.age}</p>
        </>
      );
    } else if (this.props.ui) {
      return (
        <div>
          <h1>下面是传入的内容</h1>
          {this.props.ui}
        </div>
      );
    }
    return <h1>类组件的内容，数字：{this.props.number}</h1>;
  }
}
```

**组件无法改变自身的属性**。

之前学习的 React 元素，本质上，就是一个组件（内置组件）

React 中的哲学：数据属于谁，谁才有权力改动

# 组件状态

组件状态：组件可以自行维护的数据

组件状态仅在类组件中有效

状态（state），本质上是类组件的一个属性，是一个对象

**状态初始化**
**状态的变化**

不能直接改变状态：因为 React 无法监控到状态发生了变化

必须使用 this.setState({})改变状态

一旦调用了 this.setState，会导致当前组件重新渲染

```js
//计时器，用作倒计时
import React, { Component } from "react";

export default class Tick extends Component {
  //初始化状态，JS Next 语法，目前处于实验阶段
  state = {
    left: this.props.number,
    n: 123,
  };

  constructor(props) {
    super(props);
    //初始化状态
    // this.state = {
    //     left: this.props.number
    // };
    this.timer = setInterval(() => {
      this.setState({
        left: this.state.left - 1,
      }); //重新设置状态，触发自动的重新渲染
      if (this.state.left === 0) {
        //停止计时器
        clearInterval(this.timer);
      }
    }, 1000);
  }

  render() {
    return (
      <>
        <h1>倒计时剩余时间：{this.state.left}</h1>
        <p>{this.state.n}</p>
      </>
    );
  }
}
```

**组件中的数据**

1. props：该数据是由组件的使用者传递的数据，所有权不属于组件自身，因此组件无法改变该数组
2. state：该数组是由组件自身创建的，所有权属于组件自身，因此组件有权改变该数据

```js
import React, { Component } from "react";

export default class A extends Component {
  state = {
    n: 123,
  };

  constructor(props) {
    super(props);
    setInterval(() => {
      this.setState({
        n: this.state.n - 1,
      });
    }, 1000);
  }

  render() {
    console.log("A组件重新渲染了");
    return (
      <div>
        <B n={this.state.n} />
      </div>
    );
  }
}

function B(props) {
  return (
    <div>
      B组件：{props.n}
      <C n={props.n} />
    </div>
  );
}

function C(props) {
  return <div>C组件：{props.n}</div>;
}
```

# 事件

在 React 中，组件的事件，本质上就是一个属性

按照之前 React 对组件的约定，由于事件本质上是一个属性，因此也需要使用小驼峰命名法

**如果没有特殊处理，在事件处理函数中，this 指向 undefined**

1. 使用 bind 函数，绑定 this
2. 使用箭头函数

```js
import React, { Component } from "react";
import Tick from "./Tick";

export default class TickControl extends Component {
  state = {
    isOver: false, //倒计时是否完成
  };
  // constructor(props){
  //   super(props);
  //   this.handleClick = this.handleClick.bind(this)
  // }
  // 结果：handleClick不在原型上，而在对象上
  handleClick = () => {
    console.log(this);
    console.log("点击了");
  };

  handleOver = () => {
    this.setState({
      isOver: true,
    });
  };

  render() {
    let status = "正在倒计时";
    if (this.state.isOver) {
      status = "倒计时完成";
    }
    return (
      <div>
        <Tick
          onClick={this.handleClick}
          onOver={this.handleClick}
          number={10}
        />
        <h2>{status}</h2>
      </div>
    );
  }
}
```

```js
export default class Tick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number,
    };
    // console.log(props)
    const timer = setInterval(() => {
      this.setState({
        number: this.state.number - 1,
      });
      if (this.state.number === 0) {
        clearInterval(timer);
        //倒计时完成
        this.props.onOver && this.props.onOver();
      }
    }, 1000);
  }

  render() {
    return <h1 onClick={this.props.onClick}>倒计时：{this.state.number}</h1>;
  }
}
```

# 深入认识 setState

setState，它对状态的改变，**可能**是异步的

> 如果改变状态的代码处于某个 HTML 元素的事件中，则其是异步的，否则是同步

如果遇到某个事件中，需要同步调用多次，需要使用函数的方式得到最新状态

最佳实践：

1. 把所有的 setState 当作是异步的
2. 永远不要信任 setState 调用之后的状态
3. 如果要使用改变之后的状态，需要使用回调函数（setState 的第二个参数）
4. 如果新的状态要根据之前的状态进行运算，使用函数的方式改变状态（setState 的第一个函数）

React 会对异步的 setState 进行优化，将多次 setState 进行合并（将多次状态改变完成后，再统一对 state 进行改变，然后触发 render）

```js
import React, { Component } from "react";

export default class Comp extends Component {
  state = {
    n: 0,
  };

  // constructor(props) {
  //     super(props);
  //     setInterval(() => {
  //         this.setState({
  //             n: this.state.n + 1
  //         });

  //         this.setState({
  //             n: this.state.n + 1
  //         });
  //         this.setState({
  //             n: this.state.n + 1
  //         });
  //     }, 1000)
  // }

  handleClick = () => {
    // this.setState({
    //   n: this.state.n + 1,
    // });
    //console.log(this.state.n)
    this.setState(
      (cur) => {
        //参数prev表示当前的状态
        //该函数的返回结果，会混合（覆盖）掉之前的状态
        //该函数是异步执行
        return {
          n: cur.n + 1,
        };
      },
      () => {
        //所有状态全部更新完成，并且重新渲染后执行
        console.log("state更新完成", this.state.n);
      }
    );

    this.setState((cur) => ({
      n: cur.n + 1,
    }));

    this.setState((cur) => ({
      n: cur.n + 1,
    }));
  };

  render() {
    console.log("render");
    return (
      <div>
        <h1>{this.state.n}</h1>
        <p>
          <button onClick={this.handleClick}>+</button>
        </p>
      </div>
    );
  }
}
```

# 生命周期

生命周期：组件从诞生到销毁会经历一系列的过程，该过程就叫做生命周期。React 在组件的生命周期中提供了一系列的钩子函数（类似于事件），可以让开发者在函数中注入代码，这些代码会在适当的时候运行。

**生命周期仅存在于类组件中，函数组件每次调用都是重新运行函数，旧的组件即刻被销毁**

## 旧版生命周期

React < 16.0.0

1. constructor
   1. 同一个组件对象只会创建一次
   2. 不能在第一次挂载到页面之前，调用 setState，为了避免问题，构造函数中严禁使用 setState
2. componentWillMount
   1. 正常情况下，和构造函数一样，它只会运行一次
   2. 可以使用 setState，但是为了避免 bug，不允许使用，因为在某些特殊情况下，该函数可能被调用多次
3. **render**
   1. 返回一个虚拟 DOM，会被挂载到虚拟 DOM 树中，最终渲染到页面的真实 DOM 中
   2. render 可能不只运行一次，只要需要重新渲染，就会重新运行
   3. 严禁使用 setState，因为可能会导致无限递归渲染
4. **componentDidMount**
   1. 只会执行一次
   2. 可以使用 setState
   3. 通常情况下，会将网络请求、启动计时器等一开始需要的操作，书写到该函数中
5. 组件进入活跃状态
6. componentWillReceiveProps
   1. 即将接收新的属性值
   2. 参数为新的属性对象
   3. 该函数可能会导致一些 bug，所以不推荐使用
7. **shouldComponentUpdate**
   1. 指示 React 是否要重新渲染该组件，通过返回 true 和 false 来指定
   2. 默认情况下，会直接返回 true
8. componentWillUpdate
   1. 组件即将被重新渲染
9. componentDidUpdate
   1. 往往在该函数中使用 dom 操作，改变元素
10. **componentWillUnmount**
    1. 通常在该函数中销毁一些组件依赖的资源，比如计时器

```js
import React, { Component } from "react";

export default class OldLifeCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 0,
    };
    console.log("constructor", "一个新的组件诞生了！！！");
  }

  componentWillMount() {
    console.log("componentWillMount", "组件即将被挂载");
  }

  componentDidMount() {
    console.log("componentDidMount", "挂载完成");
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "componentWillReceiveProps",
      "接收到新的属性值",
      this.props,
      nextProps
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "shouldComponentUpdate",
      "是否应该重新渲染",
      this.props,
      nextProps,
      this.state,
      nextState
    );
    if (this.props.n === nextProps.n && this.state.n === nextState.n) {
      return false;
    }
    return true;
    // return false;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate", "组件即将被重新渲染");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      "componentDidUpdate",
      "组件已完成重新渲染",
      prevProps,
      prevState
    );
  }

  componentWillUnmount() {
    console.log("componentWillUnmount", "组件被销毁");
  }

  render() {
    console.log("render", "渲染，返回的React元素会被挂载到虚拟DOM树中");
    return (
      <div>
        <h1>旧版生命周期组件</h1>
        <h2>属性n: {this.props.n}</h2>
        <h2>状态n：{this.state.n}</h2>
        <button
          onClick={() => {
            this.setState({
              n: this.state.n + 1,
            });
          }}
        >
          状态n+1
        </button>
      </div>
    );
  }
}
```

## 新版生命周期

React >= 16.0.0

React 官方认为，某个数据的来源必须是单一的

1. getDerivedStateFromProps
   1. 通过参数可以获取新的属性和状态
   2. 该函数是静态的
   3. 该函数的返回值会覆盖掉组件状态
   4. 该函数几乎是没有什么用
2. getSnapshotBeforeUpdate
   1. 真实的 DOM 构建完成，但还未实际渲染到页面中。
   2. 在该函数中，通常用于实现一些附加的 dom 操作
   3. 该函数的返回值，会作为 componentDidUpdate 的第三个参数
