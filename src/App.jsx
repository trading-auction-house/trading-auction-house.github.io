/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { selectAuthError } from './slices/authSlice';
import { selectItemsError } from './slices/itemsSlice';

// import Login from './components/auth/LoginComponent';
// import Logout from './components/auth/LogoutComponent';
// import Register from './components/auth/RegisterComponent';

// import Home from './components/common/HomeComponent';
// import Header from './components/common/HeaderComponents';
// import Error from './components/common/ErrorComponent';
// import Default from './components/common/DefaultComponent';
// import Catalog from './components/common/catalog/CatalogComponent';
// import Details from './components/common/details/DetailsComponent';
// import UserClosedOffers from './components/common/closed-offers/UserClosedOffersComponent';

// import Edit from './components/action/EditItemComponent';
// import Search from './components/action/SearchComponent';
// import CreateItem from './components/action/CreateComponent';

import { AuthGuard } from './guards/UserGuard';

import Login from './components/auth/LoginComponent';
import Register from './components/auth/RegisterComponent';
import Logout from './components/auth/LogoutComponent';

import Home from './components/common/HomeComponent';
import Header from './components/common/HeaderComponents';
import Error from './components/common/ErrorComponent';
import Default from './components/common/DefaultComponent';

import Edit from './components/action/EditItemComponent';
import Catalog from './components/common/catalog/CatalogComponent';
import Details from './components/common/details/DetailsComponent';
import UserClosedOffers from './components/common/closed-offers/UserClosedOffersComponent';
import Search from './components/action/SearchComponent';
import CreateItem from './components/action/CreateComponent';



function App() {
  const authError = useSelector(selectAuthError);
  const itemsError = useSelector(selectItemsError);
  const error = itemsError || authError;

  return (
    <div id="page-content">
      <Header />
      {error && <Error error={error} />}
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/catalog' element={<Catalog />} />
          <Route path='/details/:id' element={<Details />} />
          <Route path='/search' element={<Search />} />

          <Route element={<AuthGuard />}>
            <Route path='/closed' element={<UserClosedOffers />} />
            <Route path='/create' element={<CreateItem />} />
            <Route path='/edit/:id' element={<Edit />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Logout />} />

          <Route path='*' element={<Default />} />

        </Routes>
      </main>
      <footer>SoftUni &copy; 2024 React Redux</footer>
    </div>
  );
}

export default App;
