import React, {Component} from 'react';
import { authUser } from '../../Firebase';

class Login extends Component  {
  state = {
    user: '',
    password: '',
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    authUser(this.state.user, this.state.password)
    .then(()=>{
      this.props.history.push("/resume");
    })
    .catch((e) => {
      alert(e.message);
    })
  }

  handleChange = (e) =>{
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render () {
      return(
        <div className="login-page">
        <div className="form">
        {/* <img className="login-logo" src={logo} alt="login logo"/> */}
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="username" id="user" onChange={this.handleChange}/>
            <input type="password" placeholder="password" id="password" onChange={this.handleChange}/>
            <button>login</button>
          </form>
        </div>
      </div>
      )
  };
        
      };

export default Login;