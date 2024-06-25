/* eslint-disable @typescript-eslint/no-restricted-imports */
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { selectPersistedState } from '../../slices/authSlice';

export default function Header() {
    const state = useSelector(selectPersistedState);
    return (
        <header>
            <Link to="/" className="title-logo">
                <img src="/static/static-ass/logo.png" alt="static" />
                <span>Auction House</span>
            </Link>
            <nav className="main-nav nav-mid">
                {state && (
                    <ul>
                        <li>
                            <Link to="/catalog">Browse</Link>
                        </li>
                        <li>
                            <Link to="/search">Search</Link>
                        </li>

                        <li className="user">
                            <Link to="/create">Publish</Link>
                        </li>


                        <li className="user">
                            <Link to="/closed">Closed Auctions</Link>
                        </li>

                        <li className="user">
                            <Link to="/logout">Logout</Link>
                        </li>
                        
                    </ul>
                )}

                {!state && (
                    <ul>
                        <li>
                            <Link to="/catalog">Browse</Link>
                        </li>
                        <li>
                            <Link to="/search">Search</Link>
                        </li>

                        <li className="guest">
                            <Link to="/register">Register</Link>
                        </li>

                        <li className="guest">
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                )}

            </nav>
        </header>
    );
}