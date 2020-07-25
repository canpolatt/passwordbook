import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import  { } from "react";
import axios from "axios";

export default class Register extends Component {
    backClick = () => {
        this.props.history.push("/");
      };
      goToLoggedInPage = () => {
        this.props.history.push("/private");
      };
      constructor(props) {
        super(props);
        this.state = {
          username: "",
          password: "",
        };
      }
      changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };
      submitHandler = (e) => {
        e.preventDefault();
        console.log(this.state);
        axios
          .post("api/users/register", this.state)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      };
    
      render() {
        const { username, password } = this.state;
        return (
          <Form className="login-form">
            <form onSubmit={this.submitHandler}>
              <FormGroup>
                <Label>USERNAME</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="UserName"
                  value={username}
                  onChange={this.changeHandler}
                />
              </FormGroup>
    
              <FormGroup>
                <Label>
                  {/* <Input type = "text" placeholder = "Password" value={password} onChange={this.changeHandler}/> */}
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.changeHandler}
                  />
                </Label>
                <Button type="text" className="btn-lg btn-dark btn-block">
                  SUBMIT
                </Button>
              </FormGroup>
            </form>
    
            <div>
              <button
                onClick={this.goToLoggedInPage}
                className="btn-lg btn-dark btn-block"
              >
                Log In
              </button>
    
              <Button
                onClick={this.backClick}
                className="btn-lg btn-dark btn-block"
              >
                Back
              </Button>
            </div>
          </Form>
        );
      }
}
