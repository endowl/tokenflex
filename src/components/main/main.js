import React, { useState } from 'react';

import Connect from '../connect';
import Landing from '../landing';
import Logo from '../logo';
import NftScroller from '../nftScroller';
import Seal from '../seal';
import Product from '../product';

import './main.css';

import code from '../../images/QRCircleQRScan.png';
import placeholderNft from '../../images/StephCurrysBoredApe.jpeg';

import g1 from './Group1.png';
import g2 from './Group2.png';
import g3 from './Group3.png';
import g4 from './Group4.png';
import g5 from './Group5.png';
import g6 from './Group6.png';
import g7 from './Group7.png';

function Main() {
  const [count,setCount] = useState(1);
  // let scene = './Group' + this.state.count + '.png';
  let scene;
  if (count == 1)scene = <img src={g1}/>;
  if (count == 2)scene = <img src={g2}/>;
  if (count == 3)scene = <img src={g3}/>;
  if (count == 4)scene = <img src={g4}/>;
  if (count == 5)scene = <img src={g5}/>;
  if (count == 6)scene = <img src={g6}/>;
  if (count == 7)scene = <img src={g7}/>;
  if (count == 8)setCount(1);

  return (
    <div className="main" style={{backgroundImage: "url('./Group1.png')"}}>
      <button onClick={() => setCount(count + 1)}>next</button>
      {scene}
    </div>

    //   <div className="main-top">
    //     <div className="main-top-seal">
    //       {/* Scene 1 */}
    //       <Seal />
    //     </div>
    //     <div className="main-top-logo">
    //       <Logo />
    //     </div>
    //     <div className="main-top-connect">
    //       <Connect />
    //     </div>
    //   </div>

    //   <div className="main-middle">
    //     <div className="main-middle-landing">
    //     {/* scene 1 */}
    //       <Landing />
    //     {/* scene 2 */}
    //       {/* <NftScroller /> */}
    //     </div>
    //     <div className="main-middle-product">
    //       <Product nft={placeholderNft} seal={code} />
    //     </div>

    //   </div>

    // </div>
  );
}

export default Main;