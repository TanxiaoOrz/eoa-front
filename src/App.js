import React from 'react';
import ReactDom from 'react-dom';
import {Link} from 'react-router-dom'
const App = () => {
  return (
    <div>
      <h1>App</h1>
      {/* 把 <a> 变成 <Link> */}
      <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/home">Inbox</Link></li>
      </ul>

      {/*
        接着用 `this.props.children` 替换 `<Child>`
        router 会帮我们找到这个 children
      */}
      {this.props.children}
    </div>
  )
};

export default App;