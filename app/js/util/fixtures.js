import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import jQuery from 'jquery';

window.jQuery = jQuery;
require('bootstrap');

// Uses the user agent's Promise implementation
Reflux.use(RefluxPromise(window.Promise));
