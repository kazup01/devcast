import React from 'react'
import Home from './Home'
import Post from './Post'
import Dashboard from './Dashboard'
import Category from './Category'
import Content from './Content'
import { Route, Switch } from 'react-router-dom'

export default function Routes () {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/post" component={Post} />
          <Route path="/d/:name" component={Dashboard} />
          <Route path="/c/:category" component={Category} />
          <Route path="/:name/:title" component={Content} />
        </Switch>
      </div>
    )
}