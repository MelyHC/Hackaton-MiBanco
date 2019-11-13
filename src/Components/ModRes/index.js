import React, {Component} from 'react';
import { db } from '../../Firebase';


class ModRes extends Component {

    componentWillMount() {
        db.collection("ObsAsig").get().then((doc) => {
          doc.forEach(obs => {
        for (const key in obs.data()) {
            if (obs.data().hasOwnProperty(key)) {
            const element = obs.data()[key];
            console.log(key, element)
            }
        }                                     
          }
          )
        }).catch((error) => {
          console.log("ERROR:", error);
        }
        );
      }

    render() {
        return(
            <React.Fragment>
             <select name="zona">
            <option value="value1">Value 1</option> 
            <option value="value2" selected>Value 2</option>
            <option value="value3">Value 3</option>
            </select>
            </React.Fragment>
        )
    }
}

export default ModRes;

