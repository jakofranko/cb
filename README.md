\<some creative name\> - A Character Builder
============================================

This is a tool I'm building in Node.js to help with RPG character creation. I'm hoping to eventually have modules for many games, but right now I'm building out a builder for the [HERO System](http://www.herogames.com) (5th edition)

## General Information

<pre>npm start</pre>
Will run the app at localhost:3000

<pre>npm test</pre>
Will run the [Mocha](http://www.mochajs.org) test suite, which is the test framework I use.

Don't forget to also run these commands on a fresh pull in order to get all the libraries I use:
<pre>npm install; bower install</pre>

Uses [MongoDB](http://www.mongodb.org/) for the database, and [Mongoose](http://mongoosejs.com/) as the driver. Don't forget to run 

<pre>mongod</pre> 

before starting on you local machine!