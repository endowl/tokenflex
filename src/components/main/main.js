import Connect from '../connect';
import Landing from '../landing';
import Logo from '../logo';
import Seal from '../seal';
import Product from '../product';

import './main.css';

function Main() {
  return (
    <div className="main">

      <div className="main-top">
        <div>
          <Seal />
        </div>
        <div>
          <Logo />
        </div>
        <div>
          <Connect />
        </div>
      </div>

      <div>
        <Landing />
      </div>

      <div>
        <Product />
      </div>

    </div>
  );
}

export default Main;