# 网络相关

# 1.HTTP 缓存

HTTP 缓存又分为强缓存和协商缓存：

首先通过 Cache-Control 验证强缓存是否可用，如果强缓存可用，那么直接读取缓存
如果不可以，那么进入协商缓存阶段，发起 HTTP 请求，服务器通过请求头中是否带上 If-Modified-Since 和 If-None-Match 这些条件请求字段检查资源是否更新：

若资源更新，那么返回资源和 200 状态码
如果资源未更新，那么告诉浏览器直接使用缓存获取资源

# 2.HTTP 常用的状态码及使用场景？

1xx：表示目前是协议的中间状态，还需要后续请求
2xx：表示请求成功
3xx：表示重定向状态，需要重新请求
4xx：表示请求报文错误
5xx：服务器端错误

常用状态码：

101 切换请求协议，从 HTTP 切换到 WebSocket
200 请求成功，有响应体
301 永久重定向：会缓存
302 临时重定向：不会缓存
304 协商缓存命中
403 服务器禁止访问
404 资源未找到
400 请求错误
500 服务器端错误
503 服务器繁忙

# 3.你知道 302 状态码是什么嘛？你平时浏览网页的过程中遇到过哪些 302 的场景？

而 302 表示临时重定向，这个资源只是暂时不能被访问了，但是之后过一段时间还是可以继续访问，一般是访问某个网站的资源需要权限时，会需要用户去登录，跳转到登录页面之后登录之后，还可以继续访问。
301 类似，都会跳转到一个新的网站，但是 301 代表访问的地址的资源被永久移除了，以后都不应该访问这个地址，搜索引擎抓取的时候也会用新的地址替换这个老的。可以在返回的响应的 location 首部去获取到返回的地址。301 的场景如下：

比如从 baidu.com，跳转到 baidu.com
域名换了

# 4.HTTP 常用的请求方式，区别和用途？

http/1.1 规定如下请求方法：

GET：通用获取数据
HEAD：获取资源的元信息
POST：提交数据
PUT：修改数据
DELETE：删除数据
CONNECT：建立连接隧道，用于代理服务器
OPTIONS：列出可对资源实行的请求方法，常用于跨域
TRACE：追踪请求-响应的传输路径

# 5.你对计算机网络的认识怎么样

应用层、表示层、会话层、传输层、网络层、数据链路层、物理层

# 6.HTTPS 是什么？具体流程

HTTPS 是在 HTTP 和 TCP 之间建立了一个安全层，HTTP 与 TCP 通信的时候，必须先进过一个安全层，对数据包进行加密，然后将加密后的数据包传送给 TCP，相应的 TCP 必须将数据包解密，才能传给上面的 HTTP。
浏览器传输一个 client_random 和加密方法列表，服务器收到后，传给浏览器一个 server_random、加密方法列表和数字证书（包含了公钥），然后浏览器对数字证书进行合法验证，如果验证通过，则生成一个 pre_random，然后用公钥加密传给服务器，服务器用 client_random、server_random 和 pre_random ，使用公钥加密生成 secret，然后之后的传输使用这个 secret 作为秘钥来进行数据的加解密。

# 7.三次握手和四次挥手

为什么要进行三次握手：为了确认对方的发送和接收能力。
三次握手
三次握手主要流程：

一开始双方处于 CLOSED 状态，然后服务端开始监听某个端口进入 LISTEN 状态
然后客户端主动发起连接，发送 SYN，然后自己变为 SYN-SENT，seq = x
服务端收到之后，返回 SYN seq = y 和 ACK ack = x + 1（对于客户端发来的 SYN），自己变成 SYN-REVD
之后客户端再次发送 ACK seq = x + 1, ack = y + 1 给服务端，自己变成 EASTABLISHED 状态，服务端收到 ACK，也进入 ESTABLISHED

SYN 需要对端确认，所以 ACK 的序列化要加一，凡是需要对端确认的，一点要消耗 TCP 报文的序列化

为什么不是两次？

无法确认客户端的接收能力。

如果首先客户端发送了 SYN 报文，但是滞留在网络中，TCP 以为丢包了，然后重传，两次握手建立了连接。
等到客户端关闭连接了。但是之后这个包如果到达了服务端，那么服务端接收到了，然后发送相应的数据表，就建立了链接，但是此时客户端已经关闭连接了，所以带来了链接资源的浪费。
为什么不是四次？
四次以上都可以，只不过 三次就够了
四次挥手

一开始都处于 ESTABLISH 状态，然后客户端发送 FIN 报文，带上 seq = p，状态变为 FIN-WAIT-1
服务端收到之后，发送 ACK 确认，ack = p + 1，然后进入 CLOSE-WAIT 状态
客户端收到之后进入 FIN-WAIT-2  状态
过了一会等数据处理完，再次发送 FIN、ACK，seq = q，ack = p + 1，进入 LAST-ACK 阶段
客户端收到 FIN 之后，客户端收到之后进入 TIME_WAIT（等待 2MSL），然后发送 ACK 给服务端 ack = 1 + 1
服务端收到之后进入 CLOSED 状态

客户端这个时候还需要等待两次 MSL 之后，如果没有收到服务端的重发请求，就表明 ACK 成功到达，挥手结束，客户端变为 CLOSED 状态，否则进行 ACK 重发
为什么需要等待 2MSL（Maximum Segement Lifetime）：
因为如果不等待的话，如果服务端还有很多数据包要给客户端发，且此时客户端端口被新应用占据，那么就会接收到无用的数据包，造成数据包混乱，所以说最保险的方法就是等服务器发来的数据包都死翘翘了再启动新应用。

1 个 MSL 保证四次挥手中主动关闭方最后的 ACK 报文能最终到达对端
1 个 MSL 保证对端没有收到 ACK 那么进行重传的 FIN 报文能够到达

为什么是四次而不是三次？
\*\*
如果是三次的话，那么服务端的 ACK 和 FIN 合成一个挥手，那么长时间的延迟可能让 TCP 一位 FIN 没有达到服务器端，然后让客户的不断的重发 FIN

# 8.在交互过程中如果数据传送完了，还不想断开连接怎么办，怎么维持？

在 HTTP 中响应体的 Connection 字段指定为 keep-alive

# 9.你对 TCP 滑动窗口有了解嘛？

在 TCP 链接中，对于发送端和接收端而言，TCP 需要把发送的数据放到发送缓存区, 将接收的数据放到接收缓存区。而经常会存在发送端发送过多，而接收端无法消化的情况，所以就需要流量控制，就是在通过接收缓存区的大小，控制发送端的发送。如果对方的接收缓存区满了，就不能再继续发送了。而这种流量控制的过程就需要在发送端维护一个发送窗口，在接收端维持一个接收窗口。
TCP 滑动窗口分为两种: 发送窗口和接收窗口。

# 10.WebSocket 与 Ajax 的区别

本质不同
Ajax 即异步 JavaScript 和 XML，是一种创建交互式网页的应用的网页开发技术
websocket 是 HTML5 的一种新协议，实现了浏览器和服务器的实时通信
生命周期不同：

websocket 是长连接，会话一直保持
ajax 发送接收之后就会断开

适用范围：

websocket 用于前后端实时交互数据
ajax 非实时

发起人：

AJAX 客户端发起
WebSocket 服务器端和客户端相互推送

# 11、HTTP 如何实现长连接？在什么时候会超时？

通过在头部（请求和响应头）设置 Connection: keep-alive，HTTP1.0 协议支持，但是默认关闭，从 HTTP1.1 协议以后，连接默认都是长连接

HTTP 一般会有 httpd 守护进程，里面可以设置 keep-alive timeout，当 tcp 链接闲置超过这个时间就会关闭，也可以在 HTTP 的 header 里面设置超时时间
TCP 的 keep-alive 包含三个参数，支持在系统内核的 net.ipv4  里面设置：当 TCP 链接之后，闲置了 tcp_keepalive_time，则会发生侦测包，如果没有收到对方的 ACK，那么会每隔 tcp_keepalive_intvl 再发一次，直到发送了 tcp_keepalive_probes，就会丢弃该链接。

tcp_keepalive_intvl = 15
tcp_keepalive_probes = 5
tcp_keepalive_time = 1800

实际上 HTTP 没有长短链接，只有 TCP 有，TCP 长连接可以复用一个 TCP 链接来发起多次 HTTP 请求，这样可以减少资源消耗，比如一次请求 HTML，可能还需要请求后续的 JS/CSS/图片等

# 12.Fetch API 与传统 Request 的区别

fetch 符合关注点分离，使用 Promise，API 更加丰富，支持 Async/Await
语意简单，更加语意化
可以使用 isomorphic-fetch ，同构方便

# 13.POST 一般可以发送什么类型的文件，数据处理的问题

文本、图片、视频、音频等都可以
text/image/audio/ 或 application/json 等

# 14.TCP 如何保证有效传输及拥塞控制原理。

tcp 是面向连接的、可靠的、传输层通信协议

可靠体现在：有状态、可控制

有状态是指 TCP 会确认发送了哪些报文，接收方受到了哪些报文，哪些没有收到，保证数据包按序到达，不允许有差错
可控制的是指，如果出现丢包或者网络状况不佳，则会跳转自己的行为，减少发送的速度或者重发

所以上面能保证数据包的有效传输。
拥塞控制原理
原因是有可能整个网络环境特别差，容易丢包，那么发送端就应该注意了。
主要用三种方法：

慢启动阈值 + 拥塞避免
快速重传
快速回复

慢启动阈值 + 拥塞避免
对于拥塞控制来说，TCP 主要维护两个核心状态：

拥塞窗口（cwnd）
慢启动阈值（ssthresh）

在发送端使用拥塞窗口来控制发送窗口的大小。

然后采用一种比较保守的慢启动算法来慢慢适应这个网络，在开始传输的一段时间，发送端和接收端会首先通过三次握手建立连接，确定各自接收窗口大小，然后初始化双方的拥塞窗口，接着每经过一轮 RTT（收发时延），拥塞窗口大小翻倍，直到达到慢启动阈值。
然后开始进行拥塞避免，拥塞避免具体的做法就是之前每一轮 RTT，拥塞窗口翻倍，现在每一轮就加一个。
快速重传
在 TCP 传输过程中，如果发生了丢包，接收端就会发送之前重复 ACK，比如 第 5 个包丢了，6、7 达到，然后接收端会为 5，6，7 都发送第四个包的 ACK，这个时候发送端受到了 3 个重复的 ACK，意识到丢包了，就会马上进行重传，而不用等到 RTO （超时重传的时间）
选择性重传：报文首部可选性中加入 SACK 属性，通过 left edge 和 right edge 标志那些包到了，然后重传没到的包
快速恢复
如果发送端收到了 3 个重复的 ACK，发现了丢包，觉得现在的网络状况已经进入拥塞状态了，那么就会进入快速恢复阶段：

    会将拥塞阈值降低为 拥塞窗口的一半
    然后拥塞窗口大小变为拥塞阈值
    接着 拥塞窗口再进行线性增加，以适应网络状况

# 15.OPTION 是干啥的？举个用到 OPTION 的例子？

旨在发送一种探测请求，以确定针对某个目标地址的请求必须具有怎么样的约束，然后根据约束发送真正的请求。

比如针对跨域资源的预检，就是采用 HTTP 的 OPTIONS 方法先发送的。用来处理跨域请求

# 16.：http 知道嘛？哪一层的协议？（应用层）

灵活可扩展，除了规定空格分隔单词，换行分隔字段以外，其他都没有限制，不仅仅可以传输文本，还可以传输图片、视频等任意资源
可靠传输，基于 TCP/IP 所以继承了这一特性
请求-应答，有来有回
无状态，每次 HTTP 请求都是独立的，无关的、默认不需要保存上下文信息

缺点：

明文传输不安全
复用一个 TCP 链接，会发生对头拥塞
无状态在长连接场景中，需要保存大量上下文，以避免传输大量重复的信息

# 17.OSI 七层模型和 TCP/IP 四层模型

应用层
表示层
会话层
传输层
网络层
数据链路层
物理层

TCP/IP 四层概念：

应用层：应用层、表示层、会话层：HTTP
传输层：传输层：TCP/UDP
网络层：网络层：IP
数据链路层：数据链路层、物理层

# 18.TCP 协议怎么保证可靠的，UDP 为什么不可靠？

TCP 是面向连接的、可靠的、传输层通信协议
UDP 是无连接的传输层通信协议，继承 IP 特性,基于数据报

为什么 TCP 可靠？TCP 的可靠性体现在有状态和控制

会精准记录那些数据发送了，那些数据被对方接收了，那些没有被接收，而且保证数据包按序到达，不允许半点差错，这就是有状态
当意识到丢包了或者网络环境不佳，TCP 会根据具体情况调整自己的行为，控制自己的发送速度或者重发，这是可控制的

反之 UDP 就是无状态的和不可控制的

# 19.HTTP 2 改进

改进性能：

头部压缩
多路信道复用
Server Push

# 20.简要概括一下 HTTP 的特点？HTTP 有哪些缺点？

HTTP 特点
HTTP 的特点概括如下:

灵活可扩展，主要体现在两个方面。一个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。

可靠传输。HTTP 基于 TCP/IP，因此把这一特性继承了下来。这属于 TCP 的特性，不具体介绍了。

请求-应答。也就是一发一收、有来有回， 当然这个请求方和应答方不单单指客户端和服务器之间，如果某台服务器作为代理来连接后端的服务端，那么这台服务器也会扮演请求方的角色。

无状态。这里的状态是指通信过程的上下文信息，而每次 http 请求都是独立、无关的，默认不需要保留状态信息。

HTTP 缺点
无状态
所谓的优点和缺点还是要分场景来看的，对于 HTTP 而言，最具争议的地方在于它的无状态。
在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。
但与此同时，另外一些应用仅仅只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点。
明文传输
即协议里的报文(主要指的是头部)不使用二进制数据，而是文本形式。
这当然对于调试提供了便利，但同时也让 HTTP 的报文信息暴露给了外界，给攻击者也提供了便利。WIFI 陷阱就是利用 HTTP 明文传输的缺点，诱导你连上热点，然后疯狂抓你所有的流量，从而拿到你的敏感信息。
队头阻塞问题
当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的队头阻塞问题。接下来会有一小节讨论这个问题。

# 21.get post 区别？

有哪些请求方法？
http/1.1 规定了以下请求方法(注意，都是大写):

GET: 通常用来获取资源
HEAD: 获取资源的元信息
POST: 提交数据，即上传数据
PUT: 修改数据
DELETE: 删除资源(几乎用不到)
CONNECT: 建立连接隧道，用于代理服务器
OPTIONS: 列出可对资源实行的请求方法，用来跨域请求
TRACE: 追踪请求-响应的传输路径

GET 和 POST 有什么区别？
首先最直观的是语义上的区别。
而后又有这样一些具体的差别:

      从缓存的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会。
      从编码的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制。
      从参数的角度，GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。
      从幂等性的角度，GET 是幂等的，而 POST 不是。(幂等表示执行相同的操作，结果也是相同的)
      从 TCP 的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)

# 22 HTTP 如何处理大文件的传输？

对于几百 M 甚至上 G 的大文件来说，如果要一口气全部传输过来显然是不现实的，会有大量的等待时间，严重影响用户体验。因此，HTTP 针对这一场景，采取了范围请求的解决方案，允许客户端仅仅请求一个资源的一部分。
如何支持
当然，前提是服务器要支持范围请求，要支持这个功能，就必须加上这样一个响应头:

      Accept-Ranges: none

用来告知客户端这边是支持范围请求的。
Range 字段拆解
而对于客户端而言，它需要指定请求哪一部分，通过 Range 这个请求头字段确定，格式为 bytes=x-y。接下来就来讨论一下这个 Range 的书写格式:
0-499 表示从开始到第 499 个字节。
500- 表示从第 500 字节到文件终点。
-100 表示文件的最后 100 个字节。

服务器收到请求之后，首先验证范围是否合法，如果越界了那么返回 416 错误码，否则读取相应片段，返回 206 状态码。
同时，服务器需要添加 Content-Range 字段，这个字段的格式根据请求头中 Range 字段的不同而有所差异。
具体来说，请求单段数据和请求多段数据，响应头是不一样的。
举个例子:

```js
// 单段数据
Range: bytes = 0 - 9;
// 多段数据
Range: (bytes = 0 - 9), 30 - 39;
```

接下来我们就分别来讨论着两种情况。

单段数据
对于单段数据的请求，返回的响应如下:

```js
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

i am xxxxx

```

值得注意的是 Content-Range 字段，0-9 表示请求的返回，100 表示资源的总大小，很好理解。

多段数据
接下来我们看看多段请求的情况。得到的响应会是下面这个形式:

```js
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--

```

这个时候出现了一个非常关键的字段 Content-Type: multipart/byteranges;boundary=00000010101，它代表了信息量是这样的:

请求一定是多段数据请求
响应体中的分隔符是 00000010101

因此，在响应体中各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上--表示结束。
以上就是 http 针对大文件传输所采用的手段。

# 23. HTTP 中如何处理表单数据的提交？

在 http 中，有两种主要的表单提交的方式，体现在两种不同的 Content-Type 取值:

application/x-www-form-urlencoded
multipart/form-data

由于表单提交一般是 POST 请求，很少考虑 GET，因此这里我们将默认提交的数据放在请求体中。
application/x-www-form-urlencoded
对于 application/x-www-form-urlencoded 格式的表单内容，有以下特点:

其中的数据会被编码成以&分隔的键值对
字符以 URL 编码方式编码。

```js
// 转换过程: {a: 1, b: 2} -> a=1&b=2 -> 如下(最终形式)
"a%3D1%26b%3D2";
```

multipart/form-data
对于 multipart/form-data 而言:

请求头中的 Content-Type 字段会包含 boundary，且 boundary 的值有浏览器默认指定。例: Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe。
数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有 HTTP 头部描述子包体，如 Content-Type，在最后的分隔符会加上--表示结束。

相应的请求体是下面这样:

```js
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--

```

小结
值得一提的是，multipart/form-data 格式最大的特点在于:每一个表单元素都是独立的资源表述。另外，你可能在写业务的过程中，并没有注意到其中还有 boundary 的存在，如果你打开抓包工具，确实可以看到不同的表单元素被拆分开了，之所以在平时感觉不到，是以为浏览器和 HTTP 给你封装了这一系列操作。
而且，在实际的场景中，对于图片等文件的上传，基本采用 multipart/form-data 而不用 application/x-www-form-urlencoded，因为没有必要做 URL 编码，带来巨大耗时的同时也占用了更多的空间。

# 24.HTTP1.1 如何解决 HTTP 的队头阻塞问题？

什么是 HTTP 队头阻塞？
从前面的小节可以知道，HTTP 传输是基于请求-应答的模式进行的，报文必须是一发一收，但值得注意的是，里面的任务被放在一个任务队列中串行执行，一旦队首的请求处理太慢，就会阻塞后面请求的处理。这就是著名的 HTTP 队头阻塞问题。
并发连接
对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其它所有任务。在 RFC2616 规定过客户端最多并发 2 个连接，不过事实上在现在的浏览器标准中，这个上限要多很多，Chrome 中是 6 个。
但其实，即使是提高了并发连接，还是不能满足人们对性能的需求。
域名分片
一个域名不是可以并发 6 个长连接吗？那我就多分几个域名。
比如 content1.sanyuan.com 、content2.sanyuan.com。
这样一个 sanyuan.com 域名下可以分出非常多的二级域名，而它们都指向同样的一台服务器，能够并发的长连接数更多了，事实上也更好地解决了队头阻塞的问题。

# 25.对 Cookie 了解多少？

Cookie 简介
前面说到了 HTTP 是一个无状态的协议，每次 http 请求都是独立、无关的，默认不需要保留状态信息。但有时候需要保存一些状态，怎么办呢？
HTTP 为此引入了 Cookie。Cookie 本质上就是浏览器里面存储的一个很小的文本文件，内部以键值对的方式来存储(在 chrome 开发者面板的 Application 这一栏可以看到)。向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 进行解析，便能拿到客户端的状态。而服务端可以通过响应头中的 Set-Cookie 字段来对客户端写入 Cookie。举例如下:
// 请求头
Cookie: a=xxx;b=xxx
// 响应头
Set-Cookie: a=xxx
set-Cookie: b=xxx

Cookie 属性

生存周期
Cookie 的有效期可以通过 Expires 和 Max-Age 两个属性来设置。

Expires 即过期时间
Max-Age 用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算。

若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

作用域
关于作用域也有两个属性: Domain 和 path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。

安全相关

如果带上 Secure，说明只能通过 HTTPS 传输 cookie。
如果 cookie 字段带上 HttpOnly，那么说明只能通过 HTTP 协议传输，不能通过 JS 访问，这也是预防 XSS 攻击的重要手段。
相应的，对于 CSRF 攻击的预防，也有 SameSite 属性。
SameSite 可以设置为三个值，Strict、Lax 和 None。
a. 在 Strict 模式下，浏览器完全禁止第三方请求携带 Cookie。比如请求 sanyuan.com 网站只能在 sanyuan.com 域名当中请求才能携带 Cookie，在其他网站请求都不能。
b. 在 Lax 模式，就宽松一点了，但是只能在 get 方法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。
c. 在 None 模式下，也就是默认模式，请求会自动携带上 Cookie。
Cookie 的缺点

容量缺陷。Cookie 的体积上限只有 4KB，只能用来存储少量的信息。

性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过 Domain 和 Path 指定作用域来解决。

安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在 HttpOnly 为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

# 26 如何理解 HTTP 缓存及缓存代理？

关于强缓存和协商缓存的内容，我已经在能不能说一说浏览器缓存做了详细分析，小结如下:
首先通过 Cache-Control 验证强缓存是否可用

如果强缓存可用，直接使用
否则进入协商缓存，即发送 HTTP 请求，服务器通过请求头中的 If-Modified-Since 或者 If-None-Match 这些条件请求字段检查资源是否更新

若资源更新，返回资源和 200 状态码
否则，返回 304，告诉浏览器直接从缓存获取资源

这一节我们主要来说说另外一种缓存方式: 代理缓存。
为什么产生代理缓存？
对于源服务器来说，它也是有缓存的，比如 Redis, Memcache，但对于 HTTP 缓存来说，如果每次客户端缓存失效都要到源服务器获取，那给源服务器的压力是很大的。
由此引入了缓存代理的机制。让代理服务器接管一部分的服务端 HTTP 缓存，客户端缓存过期后就近到代理缓存中获取，代理缓存过期了才请求源服务器，这样流量巨大的时候能明显降低源服务器的压力。
那缓存代理究竟是如何做到的呢？
总的来说，缓存代理的控制分为两部分，一部分是源服务器端的控制，一部分是客户端的控制。
源服务器的缓存控制
private 和 public
在源服务器的响应头中，会加上 Cache-Control 这个字段进行缓存控制字段，那么它的值当中可以加入 private 或者 public 表示是否允许代理服务器缓存，前者禁止，后者为允许。
比如对于一些非常私密的数据，如果缓存到代理服务器，别人直接访问代理就可以拿到这些数据，是非常危险的，因此对于这些数据一般是不会允许代理服务器进行缓存的，将响应头部的 Cache-Control 设为 private，而不是 public。
proxy-revalidate
must-revalidate 的意思是客户端缓存过期就去源服务器获取，而 proxy-revalidate 则表示代理服务器的缓存过期后到源服务器获取。
s-maxage
s 是 share 的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的 max-age 并不冲突。
讲了这几个字段，我们不妨来举个小例子，源服务器在响应头中加入这样一个字段:
Cache-Control: public, max-age=1000, s-maxage=2000
复制代码相当于源服务器说: 我这个响应是允许代理服务器缓存的，客户端缓存过期了到代理中拿，并且在客户端的缓存时间为 1000 秒，在代理服务器中的缓存时间为 2000 s。
客户端的缓存控制
max-stale 和 min-fresh
在客户端的请求头中，可以加入这两个字段，来对代理服务器上的缓存进行宽容和限制操作。比如：
max-stale: 5
复制代码表示客户端到代理服务器上拿缓存的时候，即使代理缓存过期了也不要紧，只要过期时间在 5 秒之内，还是可以从代理中获取的。
又比如:
min-fresh: 5
复制代码表示代理缓存需要一定的新鲜度，不要等到缓存刚好到期再拿，一定要在到期前 5 秒之前的时间拿，否则拿不到。
only-if-cached
这个字段加上后表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回 504（Gateway Timeout）。
以上便是缓存代理的内容，涉及的字段比较多，希望能好好回顾一下，加深理解。

# 27.跨域

## JSONP

1.  JSONP 原理
    利用 <script> 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。
    JSONP 优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持 get 方法具有局限性,不安全可能会遭受 XSS 攻击。

    实现流程

声明一个回调函数，其函数名(如 show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的 data)。
创建一个<script>标签，把那个跨域的 API 数据接口地址，赋值给 script 的 src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。
服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是 show，它准备好的数据是 show('我不爱你')。
最后服务器把准备的数据通过 HTTP 协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。

## cors

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。

1. 简单请求
   只要同时满足以下两大条件，就属于简单请求
   条件 1：使用下列方法之一：

GET
HEAD
POST

条件 2：Content-Type 的值仅限于下列三者之一：

text/plain
multipart/form-data
application/x-www-form-urlencoded

请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器； XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。 2) 复杂请求
不符合以上条件的请求就肯定是复杂请求了。
复杂请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求,该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。
我们用 PUT 向后台请求时，属于复杂请求，后台需做如下配置：

```js
// 允许哪个方法访问我
res.setHeader("Access-Control-Allow-Methods", "PUT");
// 预检的存活时间
res.setHeader("Access-Control-Max-Age", 6);
// OPTIONS请求不做任何处理
if (req.method === "OPTIONS") {
  res.end();
}
// 定义后台返回的内容
app.put("/getData", function (req, res) {
  console.log(req.headers);
  res.end("我不爱你");
});
```

接下来我们看下一个完整复杂请求的例子，并且介绍下 CORS 请求相关的字段

```js
// index.html
let xhr = new XMLHttpRequest();
document.cookie = "name=xiamen"; // cookie不能跨域
xhr.withCredentials = true; // 前端设置是否带cookie
xhr.open("PUT", "http://localhost:4000/getData", true);
xhr.setRequestHeader("name", "xiamen");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.response);
      //得到响应头，后台需设置Access-Control-Expose-Headers
      console.log(xhr.getResponseHeader("name"));
    }
  }
};
xhr.send();
复制代码; //server1.js
let express = require("express");
let app = express();
app.use(express.static(__dirname));
app.listen(3000);
```

```js
//server2.js
let express = require("express");
let app = express();
let whitList = ["http://localhost:3000"]; //设置白名单
app.use(function (req, res, next) {
  let origin = req.headers.origin;
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader("Access-Control-Allow-Origin", origin);
    // 允许携带哪个头访问我
    res.setHeader("Access-Control-Allow-Headers", "name");
    // 允许哪个方法访问我
    res.setHeader("Access-Control-Allow-Methods", "PUT");
    // 允许携带cookie
    res.setHeader("Access-Control-Allow-Credentials", true);
    // 预检的存活时间
    res.setHeader("Access-Control-Max-Age", 6);
    // 允许返回的头
    res.setHeader("Access-Control-Expose-Headers", "name");
    if (req.method === "OPTIONS") {
      res.end(); // OPTIONS请求不做任何处理
    }
  }
  next();
});
app.put("/getData", function (req, res) {
  console.log(req.headers);
  res.setHeader("name", "jw"); //返回一个响应头，后台需设置
  res.end("我不爱你");
});
app.get("/getData", function (req, res) {
  console.log(req.headers);
  res.end("我不爱你");
});
app.use(express.static(__dirname));
app.listen(4000);
```

上述代码由 http://localhost:3000/index.html 向 http://localhost:4000/跨域请求，正如我们上面所说的，后端是实现 CORS 通信的关键。

## 3.postMessage

postMessage 是 HTML5 XMLHttpRequest Level 2 中的 API，且是为数不多可以跨域操作的 window 属性之一，它可用于解决以下方面的问题：

页面和其打开的新窗口的数据传递
多窗口之间消息传递
页面与嵌套的 iframe 消息传递
上面三个场景的跨域数据传递

postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

otherWindow.postMessage(message, targetOrigin, [transfer]);

message: 将要发送到其他 window 的数据。
targetOrigin:通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
transfer(可选)：是一串和 message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

## 4.websocket

Websocket 是 HTML5 的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket 和 HTTP 都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。
我们先来看个例子：本地文件 socket.html 向 localhost:3000 发生数据和接受数据
原生 WebSocket API 使用起来不太方便，我们使用 Socket.io，它很好地封装了 webSocket 接口，提供了更简单、灵活的接口，也对不支持 webSocket 的浏览器提供了向下兼容。

```js
// socket.html

<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('我爱你');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>

// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');//记得安装 ws
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
ws.on('message', function (data) {
console.log(data);
ws.send('我不爱你')
});
})
```

## 5. Node 中间件代理(两次跨域)

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。 代理服务器，需要做以下几个步骤：

接受客户端请求 。
将请求 转发给服务器。
拿到服务器 响应 数据。
将 响应 转发给客户端

## 6.nginx 反向代理

实现原理类似于 Node 中间件代理，需要你搭建一个中转 nginx 服务器，用于转发请求。
使用 nginx 反向代理实现跨域，是最简单的跨域方式。只需要修改 nginx 的配置即可解决跨域问题，支持所有浏览器，支持 session，不需要修改任何代码，并且不会影响服务器性能。
实现思路：通过 nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 cookie 中 domain 信息，方便当前域 cookie 写入，实现跨域登录。
先下载 nginx，然后将 nginx 目录下的 nginx.conf 修改如下:

```js

// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

## 7.window.name + iframe

window.name 属性的独特之处：name 值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。
其中 a.html 和 b.html 是同域的，都是 http://localhost:3000;而 c.html 是 http://localhost:4000

```js

 // a.html(http://localhost:3000/b.html)
  <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
  <script>
    let first = true
    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    function load() {
      if(first){
      // 第1次onload(跨域页)成功后，切换到同域代理页面
        let iframe = document.getElementById('iframe');
        iframe.src = 'http://localhost:3000/b.html';
        first = false;
      }else{
      // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
        console.log(iframe.contentWindow.name);
      }
    }
  </script>
```

b.html 为中间代理页，与 a.html 同域，内容为空。

```js
// c.html(http://localhost:4000/c.html)
<script>window.name = '我不爱你'</script>
```

总结：通过 iframe 的 src 属性由外域转向本地域，跨域数据即由 iframe 的 window.name 从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。

## 8.location.hash + iframe

实现原理： a.html 欲与 c.html 跨域相互通信，通过中间页 b.html 来实现。 三个页面，不同域之间利用 iframe 的 location.hash 传值，相同域之间直接 js 访问来通信。
具体实现步骤：一开始 a.html 给 c.html 传一个 hash 值，然后 c.html 收到 hash 值后，再把 hash 值传递给 b.html，最后 b.html 将结果放到 a.html 的 hash 值中。
同样的，a.html 和 b.html 是同域的，都是 http://localhost:3000;而 c.html 是 http://localhost:4000

```js
 // a.html
  <iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
  <script>
    window.onhashchange = function () { //检测hash的变化
      console.log(location.hash);
    }
  </script>

```

```js
// b.html
<script>
  window.parent.parent.location.hash = location.hash
  //b.html将结果放到a.html的hash值中，b.html可通过parent.parent访问a.html页面
</script>
```

```js
// c.html
console.log(location.hash);
let iframe = document.createElement("iframe");
iframe.src = "http://localhost:3000/b.html#idontloveyou";
document.body.appendChild(iframe);
```

## 9.document.domain + iframe

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。
只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。
实现原理：两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域。
我们看个例子：页面 a.zf1.cn:3000/a.html 获取页面 b.zf1.cn:3000/b.html 中 a 的值

```js
// a.html
<body>
 helloa
  <iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
  <script>
    document.domain = 'zf1.cn'
    function load() {
      console.log(frame.contentWindow.a);
    }
  </script>
</body>

```

```js
// b.html
<body>
  hellob
  <script>document.domain = 'zf1.cn' var a = 100;</script>
</body>
```

## 总结

            CORS支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
            JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
            不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制。
            日常工作中，用得比较多的跨域方案是cors和nginx反向代理
