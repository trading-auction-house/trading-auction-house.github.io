/* eslint-disable @typescript-eslint/no-restricted-imports */
import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { selectAuthError } from './slices/authSlice';
import { selectItemsError } from './slices/itemsSlice';

import { AuthGuard } from './guards/UserGuard';
import { GuestGuard } from './guards/GuestGuard';
import ErrorBoundary from './guards/errorboundary';

import Login from './components/auth/LoginComponent';
import Register from './components/auth/RegisterComponent';
import Logout from './components/auth/LogoutComponent';

import Home from './components/common/HomeComponent';
import Header from './components/common/HeaderComponents';
import Error from './components/common/ErrorComponent';
import Default from './components/common/DefaultComponent';
import Details from './components/common/details/DetailsComponent';
import Spinner from './components/common/Spinner';

import Edit from './components/action/EditItemComponent';
import Search from './components/action/SearchComponent';
import CreateItem from './components/action/CreateComponent';
import { SearchTable } from './components/action/SearchTable';

const Catalog = lazy(() => import('./components/common/catalog/CatalogComponent'));
const UserClosedOffers = lazy(() => import('./components/common/closed-offers/UserClosedOffersComponent'));

function App() {
  const authError = useSelector(selectAuthError);
  const itemsError = useSelector(selectItemsError);
  const error = itemsError || authError;

  return (

    <div id="page-content">
      <Header />
      {error && <Error error={error} />}
      <main>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/catalog' element={<Catalog />} />
              <Route path='/details/:id' element={<Details />} />
              <Route path='/search' element={<Search />} />
              <Route path='/search-table' element={<SearchTable />} />

              <Route element={<AuthGuard />}>
                <Route path='/closed' element={<UserClosedOffers />} />
                <Route path='/create' element={<CreateItem />} />
                <Route path='/edit/:id' element={<Edit />} />
              </Route>

              <Route element={<GuestGuard />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>

              <Route path='/logout' element={<Logout />} />

              <Route path='*' element={<Default />} />

            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer>SoftUni &copy; 2024 React Redux</footer>
    </div>
  );
}

export default App;
