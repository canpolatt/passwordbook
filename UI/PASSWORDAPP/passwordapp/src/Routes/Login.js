// import React from 'react';
//import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import LoadingOverlay from "react-loading-overlay";
import alertify from "alertifyjs";
import { Alert } from "reactstrap";

//import {EmailProvider} from'../context';

class Login extends Component {
  deneme = () => {
    this.setState({ done: false });
    document.querySelector(".cont").classList.toggle("s-signup");
  };
  backClick = () => {
    this.props.history.push("/");
  };
  goToLoggedInPage = () => {
    this.props.history.push("/tabletrying");
  };
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      willSendId: "",
      willSendName: "",
      nameError: "",
      emailError: "",
      passwordError: "",
      loginErrır: "",
      loading: false,
      loginHead: "New here?",
      loginBody:
        "Welcome to the PassBook! PassBook is a password portal that secures your paswords with a crypto function through into the database. Whenever you need them, you can copy or, see your actual passwords. Why are you waiting for? Just sign up and start to hide your passwords securely.",
      showSignIn: true,
      everythingOk: false,
    };
  }
  myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  validate = () => {
    let nameError = "";
    let emailError = "";
    let passwordError = "";
    var validator = require("email-validator");
    var checkmyemail = validator.validate(this.state.email);
    console.log(checkmyemail);
    if (!checkmyemail) {
      emailError = "Invalid email";
    } else {
      this.setState({ emailError: "" });
    }
    if (this.state.email === "") {
      emailError = "Email is requiered";
    } else {
      this.setState({ emailError: "" });
    }

    if (this.state.password !== this.state.confirmPassword) {
      passwordError = "Passwords does not match. Please try again.";
    } else {
      this.setState({ passwordError: "" });
    }
    if (passwordError || emailError) {
      this.setState({ passwordError });
      this.setState({ emailError });
    }
    if (emailError === "" && passwordError === "") {
      console.log(passwordError);
      this.setState({ everythingOk: true });
    }
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = async (e) => {
    //const isValid = this.validate();
    const { email, password, name } = this.state;
    const newUser = {
      name,
      email,
      password,
    };
    if (this.state.password === "" && this.state.confirmPassword === "") {
      this.setState({ passwordError: "Password fields can not be empty!" });
    } else if (
      this.state.everythingOk === true &&
      this.state.password === this.state.confirmPassword
    ) {
      this.setState({ loading: true });
      e.preventDefault();
      console.log(this.state.everythingOk);
      try {
        const response = await axios.post(
          "https://localhost:44332/Users/Register/",
          newUser
        );
        e.preventDefault();

        this.deneme();
        //this.goToLoggedInPage();
      } catch (error) {
        alertify.set("notifier", "position", "bottom-center");
        alertify.error("This email has already been taken!");
        //this.setState({emailError: "This e-mail has already been taken!"})
      }
    } else {
      alertify.set("notifier", "position", "bottom-center");
      alertify.error("First you should fix errors.");
    }

    this.setState({ nameError: "" });

    this.setState({ loginHead: "Registration Succesful!" });
    this.setState({ loginBody: "Please login now." });

    this.setState({ loading: false });
  };

  loginHandler = async (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const isValid = this.validate();
    const { name, email, password } = this.state;
    const response = await axios.get(
      "https://localhost:44332/Users/Login/" + email + "/" + password
    );

    if (response.status === 200) {
      //alertify.set("notifier", "position", "top-center");
      //alertify.success("✓ Succesfully logged in!");

      this.setState({ willSendId: response.data.id });
      console.log(response);
      console.log(response.data);
      console.log(response.data.id);
      console.log(response.data.name);
      localStorage.setItem("willSendId", this.state.willSendId);
      this.setState({ willSendName: response.data.name });
      localStorage.setItem("willSendName", this.state.willSendName);
      let checker = localStorage.getItem("loginCheck");
      checker = true;
      localStorage.setItem("loginCheck", checker);
      this.goToLoggedInPage();
    } else {
      console.log("wrong login");
      this.setState({ loginErrır: "Email or Password is wrong!" });
    }
    this.setState({ loading: false });
  };
  denemeler = () => {
    this.validate();
  };
  render() {
    const { name, email, password, confirmPassword } = this.state;
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Processing..."
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(40, 116, 166, 0.4)",
          }),
        }}
      >
        <div className="cont">
          <div className="form sign-in">
            <h2>Sign In</h2>
            <label>
              <span>E-Mail</span>
              <input
                type="text"
                name="email"
                placeholder="Type your e-mail here..."
                value={email}
                onChange={this.changeHandler}
              />
            </label>
            <div style={{ fontSize: 12, color: "red" }}>
              {this.state.emailError}
            </div>
            <label>
              <span>Password</span>
              <input
                id="myInput"
                type="password"
                name="password"
                placeholder="Type your password here..."
                value={password}
                onChange={this.changeHandler}
              />
            </label>
            <br></br>
            <label>
              <span>Show Password</span>
              <input type="checkbox" onClick={this.myFunction.bind(this)} />
            </label>
            <button
              className="submit"
              type="button"
              onClick={this.loginHandler}
            >
              Sign In
            </button>
            <div style={{ fontSize: 20, color: "red" }}>
              {this.state.loginErrır}
            </div>
            <p className="forgot-pass">Forgot Password ?</p>
          </div>

          <div className="sub-cont">
            <div className="img">
              <div className="img-text m-up">
                <h2>{this.state.loginHead}</h2>
                <p>{this.state.loginBody}</p>
              </div>
              <div className="img-text m-in">
                <h2>One of us?</h2>
                <p>
                  If you already has an account, just sign in. We've missed you!
                </p>
              </div>
              <div onClick={this.deneme} className="img-btn">
                <div></div>
                <span className="m-up">Sign Up</span>

                <span className="m-in">Sign In</span>
              </div>
            </div>
            <div className="form sign-up">
              <h2>Sign Up</h2>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.changeHandler}
                />
              </label>
              <br></br>
              <label>
                <span>email</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.changeHandler}
                  onBlur={this.denemeler}
                />
              </label>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.emailError}
              </div>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.changeHandler}
                />
              </label>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.passwordError}
              </div>
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.changeHandler}
                  onBlur={this.denemeler}
                />
              </label>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.passwordError}
              </div>
              <button
                type="button"
                className="submit"
                onClick={this.submitHandler}
              >
                Sign Up Now
              </button>
              <div></div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}
export default Login;
