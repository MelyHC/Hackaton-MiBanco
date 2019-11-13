import React from 'react';
import ViewRegister from '../src/Components/convenios-tecas/ViewRegister';
import ObsAsig from './Components/ObsAsig';
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
<<<<<<< HEAD
        {/* <Route exact path="/resume" component={ModResume}></Route> */}
=======

>>>>>>> dad3464c0d5739363b54576af52296cbc3647eb5
        <Route exact path="/options" component={ModOptions}></Route>
        <Route exact path="/obs" component={ObsAsig}></Route>
        <Route exact path="/register"> <ViewRegister/>
    </Route>
      </Switch>
    </Router>
  );
}

export default App;