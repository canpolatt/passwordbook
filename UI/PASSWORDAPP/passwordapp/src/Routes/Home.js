import React, { Component, Button } from "react";
import { Link } from "react-router-dom";

import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  gotoSecondPage = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <div>
        <button onClick={this.gotoSecondPage}>START</button>
      </div>
    );
  }
}

export default Home;
