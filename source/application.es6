import 'babel-polyfill';

// Expose jQuery globally with webpack
import $ from 'expose?$!expose?jQuery!jquery';

// Bootstrap
import 'bootstrap-webpack!./config/bootstrap.config.js';
import './config/bootstrap.config.less';

// Font-awesome
import 'font-awesome-webpack!./config/font-awesome.config.js';
import './config/font-awesome.config.less';

import './application.styl';

import ContactForm from './app/contact/contact_form';
import PopupForm from './app/popup/popup_form';
import LoginForm from './app/login/login_form';
import GamersForm from './app/gamers/gamers_form';
import Gallery from './app/gallery/gallery';

$(() => {
  new ContactForm($('.contact-form form'));
  new PopupForm($('.popup-form form'));
  new LoginForm($('.login-form form'));
  new Gallery($('.lightgallery'));
  new GamersForm($('.gamers-form form'));

  // Menu
  $('.navbar').on('click', ' .dropdown-menu a', () => {
    $('.navbar-collapse').removeClass('in');
  });
});