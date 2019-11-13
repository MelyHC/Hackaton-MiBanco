import React, {Component} from 'react';
import { authUser } from '../../Firebase';
import {Button, FormControl, InputGroup} from 'react-bootstrap';


class Login extends Component  {
  state = {
    user: '',
    password: '',
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    authUser(this.state.user, this.state.password)
    .then(()=>{
      this.props.history.push("/options");
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

        <div className="cont-login">
          <figure className="logo-login"></figure>
          <div className="login">
          <label>Código de Matrícula</label>
          <InputGroup className="mb-3">

            <FormControl
            id="user"
            placeholder="Usuario"
            aria-label="Username"
            aria-describedby="user"
            onChange={this.handleChange}
            />
            </InputGroup>
            <label>Contraseña</label>
            <InputGroup className="mb-3">
            <FormControl
            id="password"
            type="password"
            placeholder="Contraseña"
            aria-label="Username"
            aria-describedby="password"
            onChange={this.handleChange}
            />
            </InputGroup>
            <Button variant="success"
            onClick={this.handleSubmit}
            type="submit"  
            value="/options"
            >Login</Button>
          </div>
        </div>

      )
  };
        
      };

export default Login;