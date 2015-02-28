var stream = require('stream');
var util = require('util');
var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var Writable = stream.Writable || require('readable-stream').Writable;
//var Busboy = require('busboy');
var multer = require('multer');

var memStore = { };



/* Writable memory stream */
function Streaming(key, options) {
  // allow use without new operator
  if (!(this instanceof Streaming)) {
    return new Streaming(key, options);
  }
  Writable.call(this, options); // init super
  this.key = key; // save key
  memStore[key] = new Buffer(''); // empty
}
util.inherits(Streaming, Writable);

Streaming.prototype._write = function (chunk, enc, cb) {
  // our memory store stores things in buffers
  var buffer = (Buffer.isBuffer(chunk)) ?
    chunk :  // already is Buffer use it
    new Buffer(chunk, enc);  // string, convert

  // concat to the buffer already there
  memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
  cb();
};

var memoryStream = new Streaming('streaming');

router.get('/', function (req, res, next) {
  res.render('streaming', {title: 'streamApp'});
});

router.post('/',multer({
    upload:null,// take uploading process

    onFileUploadStart:function(file){
        //set upload with WritableStream
        /*this.upload = fs.createWriteStream({
            filename:file.originalname,
            mode:"w",
            chunkSize:1024*4,
            content_type:file.mimetype,
            root:"fs"
        });*/
        console.log("start recieving file");
    },

    onFileUploadData:function(file,data) {
        //put the chucks into db
        //this.upload.write(data);
        console.log("git a chunk");
    },

    onFileUploadComplete:function(file) {
        //end process
        /*this.upload.on('drain',function() {
            this.upload.end();
        });*/
    }
}),function(req,res) {
    res.sendStatus(200);
});

router.post('/tmp', function(req, res, next) {


    if(done==true){
        console.log(req.files);
        res.end("File uploaded.");
    }
  /*var busboy = new Busboy({ headers: req.headers });

  console.log('busboy', busboy)

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));

  });
  busboy.on('finish', function() {
    console.log('Done parsing form!');
    res.writeHead(303, { Connection: 'close', Location: '/' });
    res.end();
  });*/


/*  req.on('data', function(data) {
    memoryStream.write(data);
    console.log('memoryStream.readable', memoryStream.readable )
  });

  req.on('readable', function(readable) {
    console.log('readable', readable)
  });

  req.on('end', function() {
    console.log('upload ended')
  });

  req.on('response', function() {
    console.log('response emitted')
  });*/


  //console.log('body: ', req.body, 'files: ', req.files);
  //res.status(204);


  //res.end("File uploaded.");
  /*fs.readFile(req.files.displayImage.path, function (err, data) {
    // ...
    var newPath = __dirname + "/uploads/uploadedFileName";
    fs.writeFile(newPath, data, function (err) {
      res.redirect("back");
    });
  });*/
});

router.get('/video.mp4', function (req, res, next) {

  memoryStream.on('readeable', function(chunk) {
    console.log('got %d bytes of data', chunk.length);
  });

  /*fs.readFile(path.join(__dirname, '/../public/videos/trailer.webm'), function (err, data) {
    if (err) {
      throw err;
    }

    var range = req.headers.range;
    var total = data.length;

    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total - 1;

    var chunksize = (end - start) + 1;

    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": 'video/webm'
    });

    res.end(data);
  });*/

});

module.exports = router;
