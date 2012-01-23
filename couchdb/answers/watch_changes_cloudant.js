/***
 * Excerpted from "Seven Databases in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/rwdata for more book information.
***/

// JIMNOTE: This is still quite experimental

var
  
  http = require('http'),
  https = require('https'),
  
  // pull user/pass from the command line
  user = process.argv[2],
  password = process.argv[3],
  
  host = user + '.cloudant.com',
  auth = 'Basic ' + (new Buffer(user + ':' + password)).toString('base64');

/*/
  couchdb = http.createClient(443, host, true),
  request = couchdb.request('GET', '/music/_changes', {
    'Host': host,
    'Authorization': auth
  })
  .on('response', function (response) {
    response.on('data', function (data) {
        util.print(data);
    });
  })
  .end();
//*/


/*/
var
  
  https = require('https'),
  
  // pull user/pass from the command line
  user = process.argv[2],
  password = process.argv[3],
  
  // build up path
  db = "music",
  host = user + ".cloudant.com",
  port = 443,
  creds = user + ":" + password + "@",
  auth = "Basic " + new Buffer(user + ":" + password).toString("base64"),
  path = "/" + db + "/_changes?feed=continuous&since=",
  url = "https://" + creds + host + path,
  
  buffer = "",
  since = 0,
  error = null,
  
  processBuffer = function(callback) {
    
    var pos = buffer.lastIndexOf("\n");
    
    if (pos !== -1) {
      
      buffer
        .substr(0, pos)
        .split("\n")
        .forEach(function(line) {
          var output;
          if (line) {
            output = JSON.parse(line);
            since = output.last_seq || output.seq;
            error = output.error || null;
            callback(output);
          }
        });
      
      buffer = buffer.substr(pos + 1);
      
    }
    
  },
  
  watchForChanges = function(callback) {
    
    https
      .request({
        host: host,
        port: port,
        username: user,
        password: password,
        path: "/music/_changes?feed=continuous",
        auth: auth,
        method: "GET"
      }, function(res) {
        
        buffer = "";
        
        res.on('data', function (chunk) {
          console.log(chunk + '');
          buffer += chunk;
          processBuffer(callback);
        });
        
        res.on('end', function() {
          processBuffer(callback);
          if (!error) {
            watchForChanges(callback);
          }
        })
          
      })
      .on('error', function(e) {
        console.log('Opps, there was an error: ' + e.message);
      });
      
  };

//watchForChanges(function(output) {
//  console.log(output);
//});

//console.log(url);

//*/

