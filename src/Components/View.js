import React from 'react';
import {Link} from 'react-router-dom';

const View = () => {
return (
    <div>
      <nav className="nav">
        <ul className="column">
          <li>  <Link className="link" to="/register"> Convenios y Teka </Link></li> 
        </ul>
      </nav>
    </div>
  )
}
export default View;