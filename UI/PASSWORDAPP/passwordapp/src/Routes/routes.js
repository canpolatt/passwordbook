import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Private from "./Private";
import NotFound from "./NoutFound";
import TableTrying from "../tabletrying";
import { Tab } from "react-bootstrap";
var loggedIn = true;
export default () => (
  <BrowserRouter className="cont">
    <Switch>
      <Route path="/" exact component={Login} />

      {/* <Route
        path="/private"
        exact
        render={() =>
          loggedIn ? (
            <Private />
          ) : (
            (alert("Yanlissss"), (<Redirect to={{ pathname: "login" }} />))
          )
        }
      /> */}
      {/* <Route
        path="/TableTrying"
        exact
        render={() =>
          loggedIn ? (
            <TableTrying />
          ) : (
            (alert("Yanlissss"), (<Redirect to={{ pathname: "login" }} />))
          )
        }
      /> */}
      <Route path="/TableTrying" exact component={TableTrying} />
      <Route render={() => <NotFound />} />
    </Switch>
  </BrowserRouter>
);
