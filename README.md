# parcel-react-typescript

# 第一步（实现parcel极简项目)

初始目录结构：
```
.gitignore
package.json
src/
  index.html
  index.js
  index.css
```
src/index.html：主页面打包入口，提供根元素标签，引入index.js,：
```
<body>
  <div id="root"></div>
  <script src="./index.js"></script>
</body>

```
src/index.js：代码入口，可引入样式文件
```
import './index.css'
console.log('hello, world')
```

全局安装parcel-bundler:
```
yarn global add parcel-bundler
```

打包编译

```
> parcel src/index.html
```
编译默认输出结果:
```
.cache/ 缓存文件（可禁用）
.dist/
  index.html
  1b4f7d82694c45034ccc030b7fc7d673.js
  1b4f7d82694c45034ccc030b7fc7d673.css
```
同时启动服务器，热加载
```
Server running at http://localhost:1234
```
可以看到页面空白，控制台打印 hello，world

parcel --help,查看可用参数，可指定打包参数：
```
-p, --port 端口，

--https

-o, --open 打开默认浏览器

--no-cache 禁用缓存

--no-hmr 禁用热加载

-d, --out-dir 指定输出目录，默认dist
```
例如：
```
parcel src/index.html -p 2234 -d build -o --https
```

将打包命令写入package.json脚本
```
"script": {
  "serve": "parcel src/index.html -o"
}
```
可使用npm run serve 或者 yarn serve 运行脚本

# 第二步 （使用typscript和stylus)

将 index.js 改为index.tsx, 添加ts代码
```
import './index.styl"
let name:string = 'world'
console.log(`hello, ${name}`)
```
同时修改index.html中的引用
parcel打包到.tsx文件，会自动安装typscript包，编译成功执行。

将index.css 改为index.styl,添加样式代码
```
.red
  color red
```
同时修改index.tsx中的引用,
parcel打包到.styl文件(注意要有内容），会自动安装stylus包，编译成功执行

检查dist目录最新文件，可以看到编译后的结果
```
# dist/bb0ecd2dd0e7330a1f09c1d88ceca736.css

.red {
  color: #f00;
}
```
```
# dist/bb0ecd2dd0e7330a1f09c1d88ceca736.js

"use strict";
exports.__esModule = true;
require("./index.styl");
var name = 'world';
console.log("hello, " + name);

```

# 第三步(使用react)
安装 react,react-dom
```
yarn add react react-dom
```
修改 index.tsx 文件
```
import './index.styl'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
let name:string = 'world'
const Hello = (
  <h1> hello, {name}</h1>
)
class Root extends React.component {
  render () {
    return (
      <div>
        <Hello />
      </div>
    )
  }
}

ReactDOM.render(Root, document.getElementById('root') as HTMLElement)
```
编译失败，不能编译jsx代码
```
  16 | var name = 'world';
> 17 | var Hello = (<h1> hello, {name}</h1>);
     |              ^
  18 | var Root = /** @class */ (function (_super) {
  19 |     __extends(Root, _super);
  20 |     function Root() {

```
思考一下，parcel是要把代码编译成js来运行的，parcel直接安装了typescript，直接编译tsx文件，其中的jsx语法是编译失败的。我们要解决jsx的编译问题。
先搜索一下jsx,再搜一下tsx,发现：

jsx主要react用的，react的示例项目(大多集成webpack)配置中，都使用了babel相关包,进行了相应配置编译;

typescript支持编译jsx,但需要进行相关配置。


# 第四步 配置typescript, 启用jsx编译
typescript， 本身有tsc命令行工具, 可以直接加--jsx参数， 编译指定文件
```
> tsc index.tsx --jsx
```
更常用的使用 tsconfig.json 配置文件,开启jsx选项

于是，我们新建一个tsconfig.json文件，注意，建完空文件，原本没报错提示的index.tsx文件，现在给出了报错，"无法使用JSX, 除非提供--jsx标识"

jsx配置有3个选项，preseve, react, react-native,
- preseve, 生成 jsx 文件， 保留jsx代码交给下一位（比如babel)二次编译
- react, 生成js文件，将jsx编译成最终的 React.createElement
- react-native, 生成js文件, 保留jsx代码留待二次编译，

我们使用react
```
# tsconfig.json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```
到此为止，页面本应如期显示，然而我犯了一个低级的错误,导致页面控制台报错如下:
```
Uncaught TypeError: Object prototype may only be an Object or null: undefined
```
搜索这条报错，根本得不到解决，它大致表明下面的代码中某个对象不合法，
```
import './index.styl'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
let name:string = 'world'
const Hello = (
  <h1> hello, {name}</h1>
)
class Root extends React.component {
  render () {
    return (
      <div>
        <Hello />
      </div>
    )
  }
}
```
编辑器没有任何报错。我把 Root 改成 变量式写法，没问题，改回类写法，还是报错，在做了一些无用功之后，我的思维成功跑偏，我怀疑类写法，React.component这个函数是不是编译出了问题，我安装了babel（某个示例中使用了babel,相应配置),我给tsconfig.json添加了一系列配置(某个示例中配置），然并卵。
我又把hello拿到Hello.tsx，使用类写法导出Hello组件, Root写成变量，如下：
```
# Hello.tsx

import * as React from 'react'

export default class Hello extends React.component {
  render() {
    return (
      <h1>hhhh</h1>
    )
  }
}

```
```
# index.tsx

import './index.styl'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Hello from './Hello'
const Root = (
  <div>
   <Hello></Hello>
   </div>
)
ReactDOM.render(Root, document.getElementById('root') as HTMLElement)
```
然并卵。

我又想到我没有安装类型声明文件（因为并没有报错），赶紧补上@types/react，@types/react-dom;

然并卵，并且出现了新的编辑器报错
```
[ts]
JSX 元素类型“Hello”不是 JSX 元素的构造函数。
  类型“Hello”中缺少属性“setState”。
```

心累。。。。
我茫然呆呆de看着代码，看了一会，打开了react官网，看看class类语法，扫了一眼，
再扫一眼，！！！！！！！！
我看到了什么！
```
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
人家用的是大写开头的Component！！！！！！

反手给自己一巴掌！

心累都怪眼瞎。。。

不过，解决掉bug总是值得一点高兴的。接着解决新的bug。

编辑器是中文版的，报错是中文的，搜不到。。灵机一动，google翻译了中文报错，
然后搜索英文，nice, 搜到好几个。挨个看下来，很好， Microsoft/Typescript，的issue#18134里给出了具体原因
```
React declaration file changed to give props and state a default of {}. and thus they have no properties. the fix here is to change https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L274 to be object instead of {}.
```
```
The issue seems to be with @types/react, removing it (and all packages that have it as a dependency) resolves the error, and ES6 components are imported with type any. I am still not seeing any effect by annotating the ES6 class with @augments {React.Component<any, any>}.
```
一个方法是，修改@types/react/index.d.ts

一个方法是，删除@types/react包

我选择后者,因为它并没有因为缺乏声明文件报错(why?),顺带@types/react-dom也删了。
至此，页面如期正常显示了hello world。

坑爹的是，在我复原bug过程，编辑器竟然给出了component的标红报错，是反应迟钝吗。。。

不管怎样，在程序的世界，粗心是要付出巨大的代价的。。。

接下来，引入路由

# 第五步 （配置路由）
很简单，react官方路由react-router是核心库，针对web端dom绑定有包装过的react-router-dom（安装它，会同时安装react-router),类似还有react-router-native,react-router-redux，我们直接安装react-router-dom。
```
yarn add react-router-dom
```
阅读文档，发现，它是所谓动态路由，与常用的静态路由很不同。
静态路由是写好一个路由配置文件，再导入使用。
动态路由，是在页面组件上直接使用直接配置，也就是把路由配置文件拆解了，化用到组件里。

大致使用如下（模拟用法，非可用示例）：
```
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
const HelloA = <h1>hello, A</h1>
const HelloB = <h1>hello, B</h1>
const HelloC = <h1>hello, C</h1>
const Root = (
  <Router>
    <Link to="/a">A</Link>
    <Link to="/b">B</Link>
    <Link to="/c">C</Link>
    <Route path="/a" component={HelloA} />
    <Route path="/b" component={HelloB} />
    <Route path="/c" component={HelloC} />
  </Router>
)
```
这里，Router代表一个路由容器或者视图view, 由Route定义一个个路由，导向的页面展示在Router里，Link是路由链接，静态路由是把Route写成配置文件的，页面里只有Router-view和Router-link可以猜测一下，几个Link是处于默认路由页面的，点击A，或者地址/a,大概会变成这样
```
<Router>
<h1>hello,A</h1>
</Router>
```
上面的代码会爆错误，如下：

1. componentABC,不能是jsx对象写法，必须是函数。
```
const HelloA = () => <h1>hello, A</h1>
const HelloB = () => <h1>hello, B</h1>
const HelloC = () => <h1>hello, C</h1>
```
或者这样, 使用render属性
```
const HelloA = <h1>hello, A</h1>
<Route path="/a" render={() => HelloA} />
<Route path="/b" render={() => <h1>hello ,B</h1>} />
```
2. Router容器只能有一个子元素, 要给它里面的元素包个壳子。也就是Router本身不渲染标签。
```
<Router>
  <div class="router-root">
    <Route />
    <Route />
  </div>
</Router>
```
3. 上面的猜测错了。路由链接并没有被覆盖, 并且作为"/"根路由页面内容渲染的。
```
<div class="router-root">
  <a href="/a">A</a>
  <a href="/b">B</a>
  <a href="/c">C</a>
  <h1>hello, A</h1>
</div>
```
4. 注意react中class要变成className
下面试一试嵌套路由
```
const HelloA = () => (
  <div className="hello-a">
    <h1>hello, A</h1>
    <Link to="/a/b">B</Link>
    <Route path="/a/b" component={HelloB} />
  </div>
)
const HelloB = () => (
  <div className="hello-b">
    <h1>hello, B</h1>
    <Link to="/a/b/c">C</Link>
    <Route path="/a/b/c" component={HelloC} />
  </div>
)
const HelloC = () => <h1>hello, C</h1>
const Root = (
  <Router>
    <div className="router-root">
    <Link to="/a">A</Link>
    <Route path="/a" component={HelloA} />
    </div>
  </Router>
)
ReactDOM.render(Root, document.getElementById('root') as HTMLElement)
```

综上，路由页面是替换Route元素渲染进去的
```
<div class="router-root">
  <a href="/a">A</a>
  <div class="hello-a">
    <h1>hello, A</h1>
    <a href="/a/b">B</a>
    <div class="hello-b">
      <h1>hello, B</h1>
      <a href="/a/b/c">C</a>
      <h1>hello, C</h1>
    </div>
  </div>
</div>
```
# 函数式路由，指定跳转。
除了页面链接，在表单提交成功等情况通常需要指定跳转页面，其他框架一般都有类似下面的写法
```
this.router.push('/xx')
this.router.go('/xx')
this.history.push('/xx')
```
react-router旧版本是导出了history对象(3种），挂到Router上使用的
```
import {browserHistory/hashHistory/memoryHistory } from 'react-router'
class App extends React.Component {
  ...
  submit () {
    browserHistory.push('/app')
  }
  ...
}
<Router history={browserHistory}>
  <Route path="/app" component={App}>
</Router>
```
react-router v4中，3种Router组件分别创建了3种history对象,不需要再引用
```
<BrowserRouter></BrowserRouter>
<HashRouter></HashRouter>
<MemoryRouter><MemoryRouter>
```
使用如下, 挂到了组件的props上：
```
class HelloA extends React.Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }
  submit () {
    this.props.history.push('/a/b/c')
  }
  render () {
    return (
      <div className="hello-a">
        <h1 className="red">hello, A</h1>
        <button onClick={this.submit}>提交</button>
        <Link to="/a/b">B</Link>
        <Route path="/a/b" component={HelloB} />
      </div>
    )
  }
}
```
# 引入HTTP客户端axios
