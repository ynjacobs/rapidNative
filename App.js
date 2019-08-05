import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
import axios from 'axios';
import './App.css';
// import LandPage from './LandPage';
import ResSignup from './ResSignup';
import PatSignup from './PatSignup';
import Login from './Login';
import logo from './logo.png';
import dotenv from 'dotenv';
import ResProfile from './ResProfile';

import ResLand from './ResLand';
import PatLand from './PatLand';
import LandPage from './LandPage';

dotenv.config();

let axiosConfig = {
    withCredentials: true,
  }

    
    // function Prof(){
    //     return <Profile />
    // }



  constructor(props) ;
    super(props);
  
    this.state = {
      action: 'guest',
      user: null,
    };

    this.getTokens();
    this.handleLogin = this.handleLogin.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this);
    // this.handleAcceptMission = this.handleAcceptMission.bind(this);
  }

  
  Patient() {
      return <PatLand />
    }
    
  Responder() {
        return <ResLand handler={this.handleAcceptMission} />
    }
    
    PatSign() {
      return <PatSignup />
    }
 
    ResSign() {
      return <ResSignup />
    }
 

signUpHandler(to){
console.log("Sign Up with:", to);

if(to === 'R'){
  console.log("Sign up R");  
  this.setState({action: 'resSU'});
}else {
  console.log("Sign up P");  
  this.setState({action: 'patSU'});
}

}
  
handleLogin(event) {

    console.log("handleLogin in App", event);

    let form = event.target;
    const username = form.username.value;
    const password = form.pwd.value;
  
    axios({
      method: 'POST',
      url: process.env.REACT_APP_login,
      data: {
        username,
        password,
      },
      axiosConfig
    })
    .then(res => {
      localStorage.setItem('access-token', res.data.access);
      localStorage.setItem('refresh-token', res.data.refresh);
      this.getUser(res.data.access);
    })
    .catch(err => {
      console.log("errrrwwww", err);
    })
  }
  

  getTokens() {
    
console.log('in getTokens function');
    const refreshToken = localStorage.getItem('refresh-token');
    
    if (refreshToken) {
      axios({
        method: 'POST',
        url: process.env.REACT_APP_django_refresh,
        data: {
          refresh: refreshToken,             
        }
      })
      .then(response => {
        console.log("should call getUser", response.data)
        const accessToken = response.data.access? response.data.access: null;
        this.getUser(accessToken);

      })
      .catch(error => {
          console.log('error', error);
      });
    } 
    else {
        console.log("in else render Log()");
        this.setState.action = 'guest';
    }

  }

/* */
  getUser(accessToken) {
    // const accessToken = localStorage.getItem('access-token');
    console.log("accessToken:", accessToken)
    axios({
      method: 'GET',
      url: "http://localhost:8000/user-auth/",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then(response => {
      const user = response.data.user;
      console.log("User id:", user.id);
      const userType = user.profile.flag;
      console.log("I am:", userType, "kind of user");

      sessionStorage.setItem("userid", user.id);
      

      if(userType === 'R'){
        console.log("RRRRRR");  
        this.setState({action: 'responder'});
      }else {
        console.log("PPPPPP"); 
        this.setState({action: 'patient'});
      }

      console.log("from getUser() setting state action to:", this.state.action);

    })
  }
/**/

renderRedirect() {
console.log("in renderRedirect with", this.state.action);

  switch(this.state.action) {
    case 'responder':
      return <Redirect to="/responder/" />
    case 'patient':
      return <Redirect to="/patient/" />
    case 'resSU':
      return <Redirect to="/resSignUp/" />
    case 'patSU':
      return <Redirect to="/patSignUp/" />
    case '':
      return <Redirect to="/" />
  }

}

  render() {
    // const landPage = this.whichLandPage(this.state.action);
  return (

      <main className="App">

        <div className="landpage_main">
          <header className="header">
            <div className='mydiv'>
              <img src = { logo } alt = '' />
            </div>
          </header>
          <Router>
                  <Route path="/" exact render={(props) => <LandPage {...props} signUpHandler={this.signUpHandler} handler={this.handleLogin} />} />
                  <Route path="/patient/"  component={this.Patient} />
                  <Route path="/responder/" render={(props) => <ResLand {...props} handler={this.handleAcceptMission} /> }  />
                  <Route path="/resSignUp/" component={this.ResSign} />
                  <Route path="/patSignUp/" component={this.PatSign} />
                  {this.renderRedirect()}
              </Router>
        </div>
      </main>
      
  )}

