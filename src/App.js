import Main from './components/main';
import './App.css';
import NftImage from "./components/nft-image";

function App() {
    return (
        <div className="App">
            <NftImage contractAddress="0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb" tokenId="3100"
                      style={{width: '150px', height: '150px'}}/>
            <Main/>
        </div>
    );
}

export default App;
