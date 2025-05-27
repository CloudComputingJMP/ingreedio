import './App.scss';

import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import useCheckForcefulLogout from './hooks/useCheckForcefulLogout';
import useLoginAutomatically from './hooks/useLoginAutomatically';
import AiHome from './pages/ai_home/AiHome';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ModPanel from './pages/mod_panel/ModPanel';
import ProductDetails from './pages/product_details/ProductDetails';
import ProductList from './pages/product_list/ProductList';
import Profile from './pages/profile/Profile';
import Registration from './pages/registraton/Registration';
import { LoginState, ProtectedRoute } from './routes/ProtectedRoute';
import { ROUTES } from './routes/routes';

function App(): ReactElement {
  useLoginAutomatically();
  useCheckForcefulLogout();

  return (
    <div className="app">
      <Header />
      <div className="screen">
        <Routes>
          <Route index element={<Home />} />
          <Route
            path={ROUTES.AI}
            element={(
              <ProtectedRoute>
                <AiHome />
              </ProtectedRoute>
            )}
          />
          <Route
            path={ROUTES.LOGIN}
            element={(
              <ProtectedRoute expectedLoginState={LoginState.LOGGED_OUT}>
                <Login />
              </ProtectedRoute>
            )}
          />
          <Route
            path={ROUTES.REGISTRATION}
            element={(
              <ProtectedRoute expectedLoginState={LoginState.LOGGED_OUT}>
                <Registration />
              </ProtectedRoute>
            )}
          />
          <Route
            path={ROUTES.PROFILE}
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
          <Route
            path={ROUTES.MOD}
            element={(
              <ProtectedRoute expectedLoginState={LoginState.LOGGED_IN_MOD}>
                <ModPanel />
              </ProtectedRoute>
            )}
          />
          <Route path={ROUTES.PRODUCTS} element={<ProductList />} />
          <Route path={ROUTES.PRODUCT} element={<ProductDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
