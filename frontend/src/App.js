import React from 'react';
import {observer} from 'mobx-react';
import UserStore from './stores/UserStore'
import './App.css';
import LoginIcon from "./imgs/login-icon.png"
import LogIn from "./components/login"
import SignUp from "./components/signup"

import { css } from "@emotion/core";
import PacmanLoader from "react-spinners/ClipLoader";
 
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      isLogIn: true,
      isSignUp: false,
      email: "",
      username: "",
      password: ""
    }
  }

  selectSignUp = () => {
    this.setState({
      isLogIn: false,
      isSignUp: true})
  }

  selectLogIn = () => {
    this.setState({
      isLogIn: true,
      isSignUp: false})
  }

  handleChange = (e) => {
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async componentDidMount() {
    try {
      let res = await fetch('/isloggedin', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'Application/json',
        }
      });
      let result = await res.json();
      if (result && result.success) {
        UserStore.loading = false
        UserStore.isLoggedIn = true
        UserStore.username = result.username
      }
      else {
        UserStore.loading = false
        UserStore.isLoggedIn = false
      }
    }
    catch(e) {
      UserStore.loading = false
      UserStore.isLoggedIn = false
    }
  }

  async doLogout() {
    try {
      let res = await fetch('/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'Application/json',
        }
      });
      let result = await res.json();
      if (result && result.success) {
        UserStore.isLoggedIn = false
        UserStore.username = ''
      }
      this.setState({email: "", username: "", password: ""});
    }
    catch(e) {
      console.log(e)
    }
  }

  render() {
    if(UserStore.loading) {
      return (
        <div className="row">
          <h1>Loading...</h1>
          <PacmanLoader
            css={override}
            size={150}
            color={"#123abc"}
            loading={true}
          />
        </div>
      )
    }
    else {
      if(UserStore.isLoggedIn) {
        
        const styles = {
          marginTop: "10%"
        }

        const h1Styles = {
          fontWeight: "bolder",
          font: "400 50px/0.8 'Great Vibes', Helvetica, sans-serif"
      }

        const btnStyles = {
          borderRadius: "15px",
          backgroundColor: "#ff304f",
          color: "#fff",
          padding: "10px 20px",
          cursor: "pointer",
          outline: "none",
          border: "none"
        }
        return (
          <div className="col" style={styles}>
              <h1 style={h1Styles} >Welcome {UserStore.username}</h1>
              <button style={btnStyles} onClick={() => this.doLogout()}>Logout Button</button>
          </div>
        )
      }
      else
    return (
      <div className="wrapper row">
        <div className="left-side col">
          <img src={LoginIcon} alt="user icon" />
          <div className="welcome">Adios !</div>
        </div>
        <div className="right-side col">
          <div className="navbar row">
            <div onClick={this.selectLogIn} className={this.state.isLogIn ? "btn-selected" : "btn-not-selected"}>
              LOG IN
            </div>
            <div onClick={this.selectSignUp} className={this.state.isSignUp ? "btn-selected" : "btn-not-selected"}>
              SIGN UP
            </div>
          </div>
          {
            this.state.isLogIn 
                              ? <LogIn onChange={this.handleChange} values={this.state}  /> 
                              : <SignUp onChange={this.handleChange} values={this.state}  />
          }
        </div>
      </div>
    );
  }
}
}

export default observer(App)