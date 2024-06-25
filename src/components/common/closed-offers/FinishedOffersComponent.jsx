export default function FinishedOffers({
    buyer,
    title,
    imgUrl,
    price
}) {
    return (
        
            
            <li className="item">
                <header className="pad-med">
                    <h2> {title} </h2>
                </header>

                <div className="align-center">

                    <img className="img-thumb" src={imgUrl} alt="" />

                </div>

                <footer className="align-center pad-med">
                    <p>Closing price: <strong>${price}</strong></p>
                    from {buyer?.username} 
                </footer>
            </li>
        
    );
}