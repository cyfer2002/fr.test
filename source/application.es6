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

$(() => {
  new ContactForm($('.contact-form form'));


  // Menu
  $('.navbar').on('click', ' .dropdown-menu a', () => {
    $('.navbar-collapse').removeClass('in');
  });
});