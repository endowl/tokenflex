import './product.css';

function Product(props) {
  return (
    <div className="product">
      <div className="product-base">
        <img className="product-nft" src={props.nft} />
        <img className="product-seal" src={props.seal} />
      </div>
    </div>
  );
}

export default Product;