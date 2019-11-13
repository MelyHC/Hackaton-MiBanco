import React, {Component} from 'react';
import Header from '../Header';

class Options extends Component {

    handleClick = (e) =>{
        e.preventDefault();
        this.props.history.push(e.currentTarget.dataset.value)
        
    }

    render() {
        return(
            <React.Fragment>
                <div className="cont-options">
                <Header></Header>
               <div className="button-options">

                <div className="cont-btn-asig" data-value="/obs" onClick={this.handleClick}>
                <span className="obs-asig" >OBSERVACIONES DE ASIGNACIÓN</span>
                <figure className="btn-obs-asig"></figure>
                </div>

                <div className="cont-btn-ct" data-value="/register" onClick={this.handleClick}>
                <span className="obs-ct" >CONVENIOS Y TECAS</span>
                <figure className="btn-obs-ct"></figure>
                </div>

                <div className="cont-btn-res" data-value="/res" onClick={this.handleClick}>
                <span className="obs-res" >ASIGNACIÓN DE EJECUTIVOS</span>
                <figure className="btn-obs-res"></figure>
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

