import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Button} from 'react-bootstrap';



class Header extends Component {
    render() {
        return(
            <header className=" button-reg">
            <div>
              <figure className="logo-header"></figure> 
            </div>
            <div> 
              <h3 className="h1-header">MÓDULO DE CONVENIOS Y TECAS</h3>
            </div>
            <div>  <Link className="link-reg" to ="/"><Button variant="outline-success" type="submit" ><b> SALIR</b> </Button></Link>
            </div>
          </header>
        )
    }
}

export default Header;

