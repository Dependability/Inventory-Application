#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Brand = require('./models/brand')
var Microwave = require('./models/microwave')

var mongoose = require('mongoose');
const microwave = require('./models/microwave');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = [];
var microwaves = [];

function brandCreate(name, description,cb) {
  branddetail = {name}
  if (description != false) branddetail.description = description;
  
  var brand = new Brand(branddetail);
       
  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  }  );
}

function microwaveCreate(name, description, price, stock, brand, cb) {
  microwavedetail = {name, price, stock, brand}
  if (description != false) microwavedetail.description = description
  var mircowave = new Microwave(microwavedetail)
       
  mircowave.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Microwave: ' +microwave);
    microwaves.push(microwave);
    cb(null, microwave);
  }   );
}
function createBrands(cb) {
    async.parallel([
        function(callback) {
            brandCreate("Samsung", "South Korean company that is one of the world's largest producers of electronic devices", callback)
        },
        function(callback) {
            brandCreate("LG Electronics", "LG Electronics, Inc. engages in the manufacturing of display devices, home appliances, multimedia goods, electronic parts and develops software", callback)
    
        },
        function(callback) {
            brandCreate("General Electric", "General Electric Co. ( GE) is a global industrial company that provides power generation, renewable energy, industrial aviation products, and healthcare products and services.", callback)

        },
        function (callback) {
            brandCreate("Frigidaire", "Frigidaire Appliance Company is the American consumer and commercial home appliances brand subsidiary of multinational company Electrolux.", callback)

        }
    ], cb)
}

function createMicrowaves(cb) {
    async.parallel([
        function(callback) {
            microwaveCreate("Smart SLIM Over-the-Range Microwave with 400 CFM Hood Ventilation, Wi-Fi & Voice Control in Black Stainless Steel", false, 399.0, 10, brands[0],callback)
        },
        function(callback) {
            microwaveCreate("GE - 1.1 Cu. Ft. Mid-Size Microwave - Stainless steel", "Using this 1.1 cu. ft. GE JES1145SHSS mid-size microwave's convenience cooking controls and instant-on controls, you can quickly prepare popcorn, dinner plates, vegetables and more. The weight defrost option simplifies thawing frozen items.", 119, 50, brands[2], callback)
        },
        function(callback) {
            microwaveCreate("1.7 cu. ft. Smart Over-the-Range Convection Microwave with Air Fry", false, 629, 4, brands[1], callback)
        },
        function(callback) {
            microwaveCreate("Frigidaire Gallery 2.2 Cu. Ft. Built-In Microwave", false, 599, 29, brands[3], callback)
        },
    ], cb)
}


async.series([
    createBrands,
    createMicrowaves,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Microwaves: '+microwaves);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




