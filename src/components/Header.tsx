import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FilledButton from './FilledButton/FilledButton';
import logo from '../assets/logo.svg';
import './Header.scss';
import TextButton from './TextButton/TextButton';
import { ROUTES } from '../routes/routes';
import profileIcon from '../assets/icons/profile.svg';
import modIcon from '../assets/icons/mod.svg';
import { RootState } from '../store/reducers';

const IconsPanel = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isMod } = useSelector((state: RootState) => state.auth);

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
        <TextButton
          onClick={() => navigate(ROUTES.MOD)}
        >
          <div className="button-icon">
            <img
              src={modIcon}
              alt="moderator console"
            />
          </div>
          <div>Mod</div>
        </TextButton>
      )}
      <TextButton onClick={() => navigate(ROUTES.PROFILE)}>
        <div className="button-icon">
          <img
            src={profileIcon}
            alt="profile icon"
          />
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
