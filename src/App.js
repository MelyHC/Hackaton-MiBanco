import React from 'react';
import ViewRegister from '../src/Components/convenios-tecas/ViewRegister';
import View from '../src/Components/View';

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  
  return <Router>
  <Switch>
    <Route exact path="/register"> <ViewRegister/>
    </Route>
    <Route exact path="/"> <View/>
    </Route>
  </Switch>
</Router>
}

export default App;
