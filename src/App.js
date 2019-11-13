import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ModResume from './Components/ModuloResumen';
import Login from './Components/Login';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/resume" component={ModResume}></Route>
      </Switch>
    </Router>
  );
}

export default App;
