var request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs');


function scrape() {
  var sources = [];
  var n = 60000;

  function getData(offset) {
    var url = 'http://www.shopstyle.com/action/rawProducts?cat=26&largeCell=0&size=Large&min='
      + offset + '&count=200&vscroll=true&ssAjax=1';
    request(url, function(err, res, body) {
      var $ = cheerio.load(body);

      $('.card-inner img').each(function() {
        sources.push(this.attribs.src)
      });
      sources = sources.filter(function(src) {
        return !/pinterest/g.test(src);
      });
      console.log('Scraped ' + sources.length + ' pictures');
      
      if (sources.length >= n) {
        fs.writeFileSync('results.json', JSON.stringify(sources));
        console.log('Saved over 60000 results');
      }
    });
  }

  for (var offset = 0; offset <= n; offset += 200) {
    getData(offset);
  }
}

scrape();