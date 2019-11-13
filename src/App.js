import React from 'react';
import ViewRegister from '../src/Components/convenios-tecas/ViewRegister';
import ModResume from './Components/ModuloResumen';
import Login from './Components/Login';
import ModOptions from './Components/ComOptions'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/resume" component={ModResume}></Route>
        <Route exact path="/options" component={ModOptions}></Route>
        <Route exact path="/register"> <ViewRegister/>
    </Route>
      </Switch>
    </Router>
  );
}

export default App;
