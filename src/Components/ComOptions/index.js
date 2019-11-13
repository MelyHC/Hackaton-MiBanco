import React, {Component} from 'react';
import {Button} from 'react-bootstrap';


class Options extends Component {

    handleClick = (e) =>{
        e.preventDefault();
        this.props.history.push(e.target.value);
    }

    render() {
        return(
            <React.Fragment>
                 <Button variant="success"
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
                    >Observaciones de Asignación</Button>
            </React.Fragment>
        )
    }
}

export default Options;

