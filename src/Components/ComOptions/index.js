import React, {Component} from 'react';
import Header from '../Header';

class Options extends Component {

    handleClick = (e) =>{
        e.preventDefault();
        this.props.history.push(e.target.value);
    }

    render() {
        return(
            <React.Fragment>
                <div className="cont-options">
                <Header></Header>
               <div className="button-options">
                <div className="cont-btn-asig">
                <span className="obs-asig" onClick={this.handleClick}>OBSERVACIONES DE ASIGNACIÓN</span>
                <figure className="btn-obs-asig"></figure>
                </div>
               {/* <Button variant="success"
                  size="lg"
                  onClick={this.handleClick}
                  type="submit"  
                  value="/register"
                  >Registro de Convenio/ TECA</Button>
                  <Button variant="success"
                  size="lg"
                  onClick={this.handleClick}
                  type="submit"  
                  value="/resumen"
                  >Módulo de Resúmen</Button>
                  <Button variant="success"
                  size="lg"
                  onClick={this.handleClick}
                  type="submit"  
                  value="/obs"
                  >Observaciones de Asignación</Button> */}
               </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Options;

