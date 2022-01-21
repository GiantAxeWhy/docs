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
const h1 =(
  <>
      <h1>Hello world <span>1231</span></h1>
      <p>asdasdasd</p>
    <>
    )

React.createElement
```

## 在 JSX 中嵌入表达式

- 在 JSX 中使用注释
- 将表达式作为内容的一部分
  - null、undefined、false 不会显示
  - 普通对象，不可以作为子元素
  - 可以放置 React 元素对象
- 将表达式作为元素属性
- 属性使用小驼峰命名法
- 防止注入攻击
  - 自动编码
  - dangerouslySetInnerHTML

## 元素的不可变性

- 虽然 JSX 元素是一个对象，但是该对象中的所有属性不可更改
- 如果确实需要更改元素的属性，需要重新创建 JSX 元素
