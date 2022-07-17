import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EnviarEmail from "./components/pages/EnviarEmail";
import EnviarRascunho from "./components/pages/EnviarRascunho";
import Home from "./components/pages/Home";
import {useEffect} from "react";
import {gapi} from "gapi-script";

function App() {

    /*useEffect(() => {
       function start(){
           gapi.auth2.init({
               clientId: clientId,
               scope: ""
           })
       }
       gapi.load('client:auth2', start)
    });*/

  return (
      <Router>
          <Switch>
              <Route path='/' exact component={Home} />
              <>
              <Navbar />
                  <Route path='/EnviarEmail' component={EnviarEmail} />
                  <Route path='/EnviarRascunho' component={EnviarRascunho} />
              </>
          </Switch>
      </Router>

  );
}

export default App;
