import React, {Component} from 'react';
import {Button} from 'react-bootstrap';


class Options extends Component {
    render() {
        return(
            <React.Fragment>
                 <Button variant="success"
                    onClick={this.handleClick}
                    type="submit"  
                    value="btn"
                    >Registro de Convenio/ TECA</Button>
                                     <Button variant="success"
                    onClick={this.handleClick}
                    type="submit"  
                    value="btn"
                    >Módulo de Resúmen</Button>
                                     <Button variant="success"
                    onClick={this.handleClick}
                    type="submit"  
                    value="btn"
                    >Observaciones de Asignación</Button>
            </React.Fragment>
        )
    }
}

export default Options;

