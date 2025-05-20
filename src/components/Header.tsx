import './Header.scss';

import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import modIcon from '../assets/icons/mod.svg';
import profileIcon from '../assets/icons/profile.svg';
import logo from '../assets/logo.svg';
import { ROUTES } from '../routes/routes';
import { RootState } from '../store/reducers';
import FilledButton from './FilledButton/FilledButton';
import TextButton from './TextButton/TextButton';

const IconsPanel = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isMod } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return (
      <div className="registration-login-container">
        <div className="button-container">
          <TextButton onClick={() => navigate(ROUTES.REGISTRATION)}>
            Sign up
          </TextButton>
        </div>
        <div className="button-container">
          <FilledButton onClick={() => navigate(ROUTES.LOGIN)}>
            Log in
          </FilledButton>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-button-container">
      {isMod && (
        <TextButton onClick={() => navigate(ROUTES.MOD)}>
          <div className="button-icon">
            <img src={modIcon} alt="moderator console" />
          </div>
          <div>Mod</div>
        </TextButton>
      )}
      <TextButton onClick={() => navigate(ROUTES.PROFILE)}>
        <div className="button-icon">
          <img src={profileIcon} alt="profile icon" />
        </div>
        <div>Profile</div>
      </TextButton>
    </div>
  );
};

const Header = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div
        className="logo-container"
        role="button"
        onClick={() => navigate(ROUTES.HOME)}
        tabIndex={0}
      >
        <img src={logo} alt="Logo" />
      </div>
      <div className="right-control-container">
        <IconsPanel />
      </div>
    </div>
  );
};

export default Header;
