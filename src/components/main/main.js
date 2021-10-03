import Connect from '../connect';
import Landing from '../landing';
import Logo from '../logo';
import NftScroller from '../nftScroller';
import Seal from '../seal';
import Product from '../product';

import './main.css';

import code from '../../images/QRCircleQRScan.png';
import placeholderNft from '../../images/StephCurrysBoredApe.jpeg';

function Main() {
  return (
    <div className="main">

      <div className="main-top">
        <div className="main-top-seal">
          {/* Scene 1 */}
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
        {/* scene 1 */}
          <Landing />
        {/* scene 2 */}
          {/* <NftScroller /> */}
        </div>
        <div className="main-middle-product">
          <Product nft={placeholderNft} seal={code} />
        </div>

      </div>

    </div>
  );
}

export default Main;