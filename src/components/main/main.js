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
        <div className="main-top-seal">
          <Seal />
        </div>
        <div className="main-top-logo">
          <Logo />
        </div>
        <div className="main-top-connect">
          <Connect />
        </div>
      </div>

      <div className="main-middle">
        <div className="main-middle-landing">
          <Landing />
        </div>
        <div className="main-middle-product">
          <Product />
        </div>
      </div>

    </div>
  );
}

export default Main;