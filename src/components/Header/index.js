// Header Component

import React, { Component, useState } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import media from '../../globalStyles/media';

import SearchBox from '../SearchBox';
import LogoImage from '../../assets/images/logo-b@2.png';

const Wrapper = styled.header`
  position: relative;
  display: flex;
  width: 100%;
  height: 72px;
  padding: 0 25px;
  justify-content: space-between;
  text-align: left;
  //border-bottom: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.19);
  z-index: 1000;

  ${media.pad`
    height: 56px;
    padding: 0 8px;
  `}
`;

const Logo = styled.div`
  margin-top: 23px;
  margin-right: 30px;

  .icon {
    display: none;
  }

  img {
    width: 130px;
  }

  ${media.pad`
    margin-top: 8px;
    margin-right: 8px;
    padding: 9px;
    cursor: pointer;
  
    .icon {
      display: block;
      width: 22px;
      height: 22px;
      fill: #000000;
      overflow: hidden;
    }
  
    .logo {
      display: none;
    }

  `}
`;

const SearchBoxContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  max-width: calc(100vw - 370px);

  ${media.pad`
    margin-top: 8px;
    max-width: calc(100vw - 110px);
  `}
`;

const LangSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  margin-top: 14px !important;
  width: 125px;
  padding-bottom: 16px;
  border: none !important;
  box-shadow: none !important;
  cursor: pointer;

  .text-short {
    display: none;
  }

  .ui.dropdown {
    width: 100%;
    justify-content: space-around;
    border: 1px solid #ccc;
    border-radius: 40px !important;

    .menu > .item {
      outline: none;
    }
  }

  .menu.visible {
    display: none !important;
    top: calc(100% + 8px);
  }

  &:hover,
  &:active {
    .menu.visible {
      display: block !important;
    }
  }

  ${media.pad`
    width: 50px;
    min-height: 20px !important;
    
    .item > i.dropdown.icon {
      margin-left: 4px !important;
    }
    .ui.dropdown {
      border: none;
      border-radius: none;
      padding-left: 5px;
      padding-right: 5px;
      
      .menu > .item {
        padding-left: 5px;
        padding-right: 5px;
      }
    }

    .text {
      display: none !important;
    }

    .text-short {
      display: block;
    }
  `}
`;

function Header(props) {
  console.log('header', props);
  const { changeLanguage, toggleNavbar, intl } = props;
  const langs = ['en', 'zh'];

  return (
    <Wrapper>
      <Logo onClick={() => toggleNavbar(false)}>
        <NavLink to="/" className="logo">
          <img src={LogoImage} alt="Conflux Logo" />
        </NavLink>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconcate" />
        </svg>
      </Logo>
      <SearchBoxContainer>
        <SearchBox />
      </SearchBoxContainer>
      <LangSelector>
        <div className="ui dropdown link item">
          <span className="text">
            <FormattedMessage id={'app.header.lang.' + intl.locale} />
          </span>
          <span className="text-short">
            <FormattedMessage id={'app.header.lang.short.' + intl.locale} />
          </span>
          <i className="dropdown icon" />
          <div className="menu transition visible">
            {langs
              .filter((v) => v !== intl.locale)
              .map((lang) => (
                <div
                  className="item"
                  onClick={() => changeLanguage(lang)}
                  onKeyPress={() => changeLanguage(lang)}
                  role="menuitem"
                  tabIndex={0}
                  key={lang}
                >
                  <span className="text">
                    <FormattedMessage id={'app.header.lang.' + lang} />
                  </span>
                  <span className="text-short">
                    <FormattedMessage id={'app.header.lang.short.' + lang} />
                  </span>
                </div>
              ))}
          </div>
        </div>
      </LangSelector>
    </Wrapper>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
  changeLanguage: PropTypes.func.isRequired,
  toggleNavbar: PropTypes.func.isRequired,
};

export default injectIntl(Header);
