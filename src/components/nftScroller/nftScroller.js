import scroller from './scroller.png';
import sizeBar from './sizeBar.png';

import './nftScroller.css';

function NftScroller() {
  return (
    <div className="nftScroller">
      <div className="nftScroller-primary">
        <div>
          <img src={scroller} />
        </div>
        <div>
          <img scr={sizeBar} />
        </div>
      </div>
    </div>
  );
}

export default NftScroller;