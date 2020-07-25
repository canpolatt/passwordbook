import React, { Component } from "react";
import Login from './Login'
import axios from "axios";
import "./style.css";
import {Table} from 'reactstrap';
import LoadingOverlay from "react-loading-overlay";
import copy from "copy-to-clipboard";
export default class Private extends Component {
  deneme = () => {
    document.querySelector(".cont").classList.toggle("s-signup");
  };
    constructor(props) {
        super(props);
        this.state = {
          userId: localStorage.getItem("willSendId"),
          name: "",
          description:"",
          password: "",
          confirmPassword:"",
          posts: [],
          loading:false,
          copyPassword:""
        };
      }
      changeHandler =(e) => {
        this.setState({ [e.target.name]:e.target.value })
    }

    // submitHandler = (e) => {
    //   //this.setState({userMail: localStorage.getItem("willSedEmail")});
    //     console.log(this.userMail);
    //     if(this.state.password!==this.state.confirmPassword)
    //     alert("passwords' doesnt match.");
    //    else{
    //     e.preventDefault();
    //     console.log(this.state);
    //     axios
    //       .post("api/infos/addpassw", this.state)
    //       .then((response) => {
    //         console.log(response);
    //         if(response==='Invalid')
    //         alert("Invalid User");
    //         else this.history.push("/private");
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //    }
    //   };

    copyFunc=(passw,e)=>{
      console.log(passw);
      copy(passw);
    }
    
    getItemsHandler = async(e)=>{
      this.setState({loading:true})
      this.setState({userId: localStorage.getItem("willSendId")});
      const {userId} = this.state;
      const {sendId}={
        userId,
      }
      const response = await axios.get("https://localhost:44332/PasswalletItems/GetItem/"+userId)
      console.log(response);
      this.setState({object:response.data});
      this.setState({loading:false})
      console.log(response.data[0].password)
      console.log(response.data.length)
      this.setState({copyPassword:response.data[0].password})
    }

    submitHandler = async(e)=>{
      this.setState({loading:true})
      e.preventDefault();
      this.setState({userId: localStorage.getItem("willSendId")});
      const { userId, name, description, password} = this.state;
        const newUser = {
          userId,
          name,
          description,
          password
        }
      if(this.state.password!==this.state.confirmPassword)
      {
        alert("Passwords doesn'match please try again!");
        
      }
      
     else {
      try{
        const response = await axios.post("https://localhost:44332/PasswalletItems/AddItem/", newUser)
      e.preventDefault();
       alert("Register succeed!");
       
   
     }catch(error){
      alert("Error");
     }
    }
    this.setState({loading:false})
    };

    
  render() {
      const{name,description,password,confirmPassword,copyPassword}= this.state;

    return (
      <LoadingOverlay active={this.state.loading} spinner text="Processing..." styles={{
        overlay: (base) => ({
          ...base,
          background: 'rgba(40, 116, 166, 0.4)'
        })
      }}>

       <div className="cont">
        <h1>Welcome, {localStorage.getItem("willSendName")}</h1>
      <div className="form sign-in" >
   
        <h2>Add Your Password</h2>
        
        <label>
          <span>Platform Name</span>
          <input type="text"  name="name"
           placeholder="Type your platforname here..."
           value={name}
            onChange={this.changeHandler} />
        </label>
        <label>
          <span>Description</span>
          <input type="text"  name="description"
           placeholder="Type description here..."
           value={description}
            onChange={this.changeHandler} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password"  placeholder="Type your password here..." value={password} onChange={this.changeHandler} />
        </label>
        
        <label>
              <span>Confirm Password</span>
              <input type="password" name="confirmPassword" value={confirmPassword} onChange={this.changeHandler}/>
     </label>
        <button className="submit" type="button" onClick={this.submitHandler}>
         Submit
        </button>
   
      </div>
      //============================================================================
      <div class="overflow-auto"><div className="sub-cont">
          <div className="img">
            <div className="img-text m-up">
              <h2>New here?</h2>
              <p>Sign up and discover great amount of new opportunities!</p>
            </div>
            <div className="img-text m-in">
              <h2>One of us?</h2>
              <p>
                If you already has an account, just sign in. We've missed you!
              </p>
            </div>
            <div onClick={this.deneme} className="img-btn">
              <span className="m-up">Show</span>
              <span className="m-in">Add</span>
            </div>
          </div>
          <div className="form sign-up">
            <h2>My Passwords</h2>
            
            <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            
            {

            this.state.object != null ? (
              this.state.object.map((c) => (
                <tr key={c.id}>

                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>{c.password}</td>
                  <td><button type="button" className="bttn" onClick={this.copyFunc.bind(this,c.password)}>X</button></td>
                </tr>
              ))
            ) : (
              <tr></tr>
            )}
            
          </tbody>
          {console.log(this.state.object)}
        </Table>
            <button type="button" className="submit" onClick={this.getItemsHandler}>
              Show My PasswordList
            </button>
           
          </div>
        </div></div>
      
      //===========================================================================
      </div>
      
     

        
      </LoadingOverlay>
    );
  }
  
}
