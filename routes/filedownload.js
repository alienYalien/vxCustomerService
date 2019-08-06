var fs = require('fs');
var path = __basedir + '/public/assets/';
var p1 = path;
exports.downloadFile = function(req, res) {
	//var filename = req.params.filename;
  p1 = path + 'files/' + req.params.filename;
  //console.log(p1);
  
  res.download(p1);
}

exports.downloadImage = function(req, res){
	//var filename = req.params.filename;
  p1 = path + 'img/' + req.params.filename;
  console.log(p1);
  
  res.download(p1);  
}


exports.getimagev1 = function(req, res) {

  fs.readFile(path+'img/' + req.params.filename, function (err, content) {
    console.log(path + req.params.filename);
    if (err) {
        res.writeHead(400, {'Content-type':'text/html'})
        console.log(err);
        res.end("No such image");    
    } else {
        //specify the content type in the response will be an image
        res.writeHead(200,{'Content-type':'image/jpeg'});
        res.end(content);
    }
  });

}