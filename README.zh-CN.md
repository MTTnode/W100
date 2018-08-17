# W100



## 快速入门

<!-- 在此次添加使用文档 -->

如需进一步了解，参见 [egg 文档][egg]。

### 本地开发

```bash
下载代码：
git clone https://github.com/MTTnode/W100.git
安装以来
$ npm install
$ npm run dev
$ open http://localhost:7001/
```

### 配置文件

目录：
/W100/config/config.default.js

//mongoose配置
config.mongoose = {
  url: 'mongodb://127.0.0.1:27017/weexdb',
  options: {
  }
};

//redis配置
config.redis = {
  client: {
    port: 6379,
    host: '140.143.230.232',
    password: 'xiaotao123',
    db: 0
  }
}

//exchange_web配置
config.weexHttps = {
  client: {
    // url: "https://wwwapp.weex.com:8443/"
    url: "http://www.test.mtt.com/"
    // url: "https://www.bithe.com/"
  }
};
config.weexToken = {
  client: {
    // url: "http://wwwapp.weex.com:8000/"
    url: "http://www.test.mtt.com/"
    // url: "https://www.bithe.com/"
  }
};

//ws配置
config.weexWs = {
  client: {
    // url: "wss://wsapp.weex.com:8443"
    url: "wss://ws.bithe.com"
  }
};

### 部署

```bash
下载代码：
git clone https://github.com/MTTnode/W100.git
插件安装依赖：
进入/W100/lib/plugin插件目录，分别安装依赖，npm install
安装以来
$ npm install
启动服务
$ npm start
停止服务
$ npm stop
```

### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org
