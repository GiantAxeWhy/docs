## promise 实现

### 初见雏形

根据 promise 规范,promise 构造函数返回一个 promise 对象实例,并且有一个 then 方法,其中 then 有两个参数，分别是 onfulfilledh 和 onrejected.

onfulfilled 通过系数获取 promise 经过 resolve 的值,onreject 获取 promise 对象经过 reject 处理后的值

```js
function Promise(executor) {
  Promise.prototype.then = function (onfulfilled, onrejected) {};
}
```

promise 有三种状态 pending、fulfilled、rejected.需要一个变量储存 promise 状态。还需要有两个变量，分别储存 resolve 或者 reject 传过来的结果值。
还需要定义两个函数 resolve,reject 供开发者使用

```js
function Promise(executed){
  this.status = 'pending'
  this.value = null
  this.reason = null
  const resolve = (value)=>{
  this.value = value
}
const reject=(reson)=>{
  this.reason = reason
}
  executor(resolve, reject)
}

function noop(){}

Promise.prototype.then=function(onfulfilled,onreject)
```

### 状态完善

promise 实例的状态只能从 pending 变为 fulfilled 或者 rejected.状态一旦更改，就不能再次发生变化

```js
function Promise(executor) {
  this.status = "pending";
  this.value = null;
  this.reason = null;
  const resolve = (value) => {
    if (this.status === "pending") {
      this.value = value;
      this.status = "fulfilled";
    }
  };
  const reject = (reason) => {
    if (this.status === "pending") {
      this.reason = reason;
      this.status = "rejected";
    }
  };
  executor(resolve, reject);
}

function noop() {}
Promise.prototype.then = function (onfulfilled = noop, onrejected = noop) {
  if (this.status === "fulfilled") {
    onfulfilled(this.value);
  }
  if (this.status === "rejected") {
    onrejected(this.reason);
  }
};
```

### 实现异步

异步的关键在于 then 里面函数执行的时机，所以这里需要将 then 里面的函数先缓存下，然后 resolve 或者 reject 的时候执行。

注意 then 可以调用多次，所以需要存一个数组

当 resolve 或者 reject 的时候，全部执行。然后另外一个需要注意的细节是,当 excutor 代码本身执行就报错事，应当把 promise 的状态设置为 rejected，所以我们这里需要一个
try catch

```js
function Promise(executor) {
  this.status = "pending";
  this.value = null;
  this.reason = null;
  this.onfulfilledArr = []; // 存的都是then的第一个参数，即成功处理函数
  this.onRejectedArr = []; // 存的都是then的第二个参数，即失败处理函数
  const resolve = (value) => {
    if (this.status === "pending") {
      this.value = value;
      this.status = "fulfilled";
      this.onfulfilledArr.forEach((fn) => fn(value));
    }
  };
  const reject = (reason) => {
    if (this.status === "pending") {
      this.reason = reason;
      this.status = "rejected";
      this.onRejectedArr.forEach((fn) => fn(reason));
    }
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function noop() {}
Promise.prototype.then = function (onfulfilled = noop, onrejected = noop) {
  if (this.status === "fulfilled") {
    onfulfilled(this.value);
  }
  if (this.status === "rejected") {
    onrejected(this.reason);
  }
  if (this.status === "pending") {
    this.onfulfilledArr.push(onfulfilled);
    this.onRejectedArr.push(onrejected);
  }
};
```

#### 细节完善

目前实现到这里，已经实现了基本的异步功能。回想一下 promise 的用法

```js
let promise = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000);
});
promise.then(() => console.log("打印"));
```

之前的代码已经实现了这样的功能，即 1s 之后再进行打印操作。 但这里面有一个严重的问题还没有解决，看一下下面这个代码的输出

```js
let promise = new Promise((resolve, reject) => {
  resolve("data");
});
promise.then((data) => {
  console.log(data);
});
console.log(1);
```

promise 是微任务，应当在主循环结束之后再执行。所以这里应当先输出 1， 后输出 ‘data’, 而现在输出的结果正好相反。

所以 resolve 函数需要用 setTimeout 包裹一下，将函数执行推迟到主循环之后。但值得注意的是，setTimeout 是宏任务，并没有完全实现 promise 规范中定义的微任务。

所以有一些 promise 实现库用了 mutationObserver 来模仿 promise 原生实现。但这里为了实现方便姑且先用 setTimeout 代替。 看一下改动后的代码：

```js
const resolve = (value) => {
  setTimeout(() => {
    if (this.status === "pending") {
      this.value = value;
      this.status = "fulfilled";
      this.onfulfilledArr.forEach((fn) => fn(value));
    }
  });
};
```

### 链式调用

```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("data"), 1000);
});
promise
  .then((data) => {
    console.log(data);
    return "next"; // 这里有可能返回一个普通值，或者又一个promise
  })
  .then((data) => {
    console.log(data);
  });
```

从以上代码可以看出，then 的实现需要返回一个 promise。 then 中的回调函数的执行结果可能返回一个普通值，或者又一个 promise。 这里先处理只会返回普通值的情况:

```js
Promise.prototype.then = function (onfulfilled = noop, onrejected = noop) {
  let promise2; // then方法返回一个promise

  if (this.status === "fulfilled") {
    return (promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = onfulfilled(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }

  if (this.status === "rejected") {
    return (promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = onrejected(this.reason);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }

  if (this.status === "pending") {
    return (promise2 = new Promise((resolve, reject) => {
      this.onfulfilledArr.push(() => {
        try {
          const result = onfulfilled(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.onRejectedArr.push(() => {
        try {
          const result = onrejected(this.reason);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }
};
```

比较好理解的是，如果当前 promise 的状态是 fulfilled 和 rejected 的情况。

当 promise 处于这两种情况时，直接执行 then 里的回调函数。 然后决议 promise2 的状态， 即当前 promise 的状态为 fulfulled 时，也将 promise2 的状态 resolve 掉。

注意，这里我假设 then 里回调函数的执行结果只会返回普通值，当回调执行出错时，才会将 promise2 设为 rejected。

这里比较难理解的是，如果当前 promise 状态为 pending 时，该怎么处理。

这里其实 promise2 的决议时机就是，处理完 onfulfilledArr 或者 onfulfilledArr 里的任务后，也就是执行完之前添加的所有任务，然后决议 promise2 的状态。

### 链式调用(二) 完善异步

上面我们只处理了 then 里只返回普通值的情况，其实 then 还有可能继续返回一个 promise，这其实是我们最经常使用 promise 的情况, 如下：

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("data"), 1000);
})
  .then((data) => {
    // 又返回了一个promise
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data + 1);
      }, 1000);
    });
  })
  .then((data) => {
    console.log(data);
  });
```

将 then 里代码稍微重构一下，使其支持返回 promise

```js
Promise.prototype.then = function (onfulfilled = noop, onrejected = noop) {
  let promise2 // then方法返回一个promise

  if (this.status === 'fulfilled') {
    return (promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = onfulfilled(this.value)
          resolvePromise(result, resolve, reject) // 这里不能像之前那样直接resolve,需要把resolve传递下去，由此方法进行决议
        } catch (error) {
          reject(error)
        }
      })
    }))
  }
  ...
```

接下来看一下 resolvePromise 的实现

```js
function resolvePromise(result, resolve, reject) {
  // 如果返回promise
  if (result instanceof Promise) {
    if (result.status === "pending") {
      result.then((data) => {
        resolvePromise(data, resolve, reject); // 套娃情况，有可能then回调执行的结果的结果又是一个promise，因此递归进行处理
      }, reject);
    } else {
      result.then(resolve, reject);
    }

    return;
  }

  // 如果返回普通值直接进行决议
  resolve(result);
}
```

这几行代码比较难以理解，思路就是将上层的 resolve 传到下层，将 promise2 的决议权交个 then 函数里返回的 promise。

终于，我们已经实现 promise 80%的功能。其中还剩下一些静态方法没有实现。例如 Promise.all() Promise.race() Promise.resolve() 但已经具备了基本的状态逻辑转换，异步和链式调用功能。
