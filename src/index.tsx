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