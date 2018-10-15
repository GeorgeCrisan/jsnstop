// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
let session = require('express-session');
let MongoStore = require("connect-mongo")(session);

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'wysiwyg override toolbar': false,
	'wysiwyg cloudinary images': true,
	'wysiwyg override toolbar': true,
	'wysiwyg skin': 'lightgray',
	'wysiwyg additional buttons': 'searchreplace visualchars,'
 	+ ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
 	+' emoticons media, preview print codesample',
	'wysiwyg additional plugins': 'example, table, advlist, anchor,'
 	  + ' autolink, autosave, bbcode, charmap, contextmenu, codesample'
 	  + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
 	  + ' paste, preview, print, searchreplace, textcolor,'
 	  + ' visualblocks, visualchars, wordcount',
	'name': 'jsnstop',
	'brand': 'jsnstop',
	'sass':'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'session store': (session)=>{
		return new MongoStore({
			url: process.env.MONGOLAB_URI,
			ttl: 14 * 24 * 60 * 60 // = 14 days. Default
		})
		  
	},
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	enquiries: 'enquiries',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server

  

keystone.start();
