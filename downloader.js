var http = require('http');
var fs = require('fs');

var data = fs.readFileSync('results.json', 'utf-8');
var results;

try {
  results = JSON.parse(data);
} catch(e) {
  results = null;
}

if (results !== null) {
  var i = 0;
  function download() {
    ++i
    var result = results.pop();
    var file = fs.createWriteStream('img/' + i + '.jpg');
    var request = http.get(result, function(response) {
      response.pipe(file);
    });
    file.on('finish', function() {
      if (results.length > 0) {
        download();  
      }
    });
  }

  download();
} else {
  console.log('couldnt load file');
}