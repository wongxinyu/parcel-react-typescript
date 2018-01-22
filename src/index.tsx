import './index.styl'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
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