import { Link } from 'react-router-dom';

export function Item({
    id,
    imgUrl,
    title,
    price,
}) {
    return (
        <li className="item">
            <header className="pad-med">
                <h2>{title}</h2>
            </header>

            <div className="align-center">
                <img className="img-thumb" src={imgUrl} alt="" />
            </div>

            <footer className="align-center pad-med">
                <p>Current price: <strong>${price}</strong></p>
                <Link to={`/details/${id}`} className="action" >See details</Link>
            </footer>
        </li>
    );
}