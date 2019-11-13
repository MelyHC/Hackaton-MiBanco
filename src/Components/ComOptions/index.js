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
                <div className="menu-options">
                <div className="cont-options">
                <Header></Header>
               <div className="button-options">
                <div className="row">
<div className="col-5">
                <div className="card m-3" data-value="/obs" onClick={this.handleClick}>
                <span className="obs-asig card-body p-4 rounded-top" >OBSERVACIONES DE ASIGNACIÓN</span>
                <figure className="btn-obs-asig img-fluid mb-0"></figure>
                </div>
                </div>
                
                <div className="col-7">
                <div className="card m-3" data-value="/register" onClick={this.handleClick}>
                <span className="obs-ct card-body p-4 rounded-top" >CONVENIOS Y TECAS</span>
                <figure className="btn-obs-ct img-fluid mb-0"></figure>
                </div>

                <div className="card m-3" data-value="/res" onClick={this.handleClick}>
                <span className="obs-res card-body p-4 rounded-top" >ASIGNACIÓN DE EJECUTIVOS</span>
                <figure className="btn-obs-res img-fluid mb-0"></figure>
                </div>
                </div>
                </div>
               </div>
                </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Options;

