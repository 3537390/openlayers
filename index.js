/**
*
* Openlayers
*
*/

'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	passphrase: 'qtp6yl9vc30dg1'
};

const express = require('express');
const session = require('express-session'); // We need a session handler without memory leak!
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MemcachedStore = require('connect-memjs')(session);
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const md5 = require('js-md5');
const app = express();

// Environment variables are defined in app.yaml.
let MEMCACHE_URL = process.env.MEMCACHE_URL || '127.0.0.1:11211';

if (process.env.USE_GAE_MEMCACHE) {
  MEMCACHE_URL = `${process.env.GAE_MEMCACHE_HOST}:${process.env.GAE_MEMCACHE_PORT}`;
}

app.enable('trust proxy');
/*
app.use(session({
	secret: 'uexUDREjXXQrKqGC',
	resave: true,
	saveUninitialized: true,
	proxy: true,
	store: new MemcachedStore({
		servers: [MEMCACHE_URL]
	}),
	cookie: { path: '/', httpOnly: true, secure: true, maxAge: null }
}))
*/

app.use(cookieParser());
app.use(bodyParser.json());       										// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  	// to support URL-encoded bodies
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

let url = 'mongodb://videoDocker:GXp6lFoKJuCWLIxd@cluster0-shard-00-00-lvgwo.mongodb.net:27017,cluster0-shard-00-01-lvgwo.mongodb.net:27017,cluster0-shard-00-02-lvgwo.mongodb.net:27017/videodocker?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
let salt;

/**
 *	--- Functions --------------------------------------------------
 */

/**
*	--- Routes -----------------------------------------------------
*/

app.all('/', function(req, res, next) {
	res.sendFile(__dirname + '/views/denied.html');
});

app.all('/accessible', function(req, res, next) {
	res.sendFile(__dirname + '/views/accessible.html');
});

app.all('/animation', function(req, res, next) {
	res.sendFile(__dirname + '/views/animation.html');
});

app.all('/arcgis-image', function(req, res, next) {
	res.sendFile(__dirname + '/views/arcgis-image.html');
});

//////////////////////

const PORT = process.env.PORT || /* 8080 */ 3000;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8000);
httpsServer.listen(PORT);