/***
 * Excerpted from "Seven Databases in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/rwdata for more book information.
***/

var
  
  // bring in the http library
  http = require('http'),
  
  // set up a buffer for incoming data
  buffer = "",
  
  // keep track of the highest sequence number we've seen
  last_seq = 0,
  
  // also keep track of whether couch has reported an error
  error = null,
  
  // process any records currently in the buffer
  processBuffer = function(callback) {
    
    // find out if there are any newlines in the buffer
    var pos = buffer.lastIndexOf("\n");
    
    if (pos !== -1) {
      
      // split the buffer into lines (each is a JSON object)
      buffer
        .substr(0, pos)
        .split("\n")
        .forEach(function(line) {
          var output;
          if (line) {
          
            // parse the line as JSON
            output = JSON.parse(line);
            
            // keep track of the highest sequence number we've seen
            last_seq = output.last_seq || output.seq;
            
            // keep track of whether couch has reported an error
            error = output.error || null;
            
            // pass the output object through to the callback
            callback(output);
            
          }
        });
      
      // truncate the buffer (chops off records already processed)
      buffer = buffer.substr(pos + 1);
      
    }
    
  },
  
  // monitor couch for changes, call calback when they happen
  watchForChanges = function(callback) {
    
    // options for the next request
    var options = {
      host: 'localhost',
      port: 5984,
      path: '/music/_changes?feed=continuous&since=' + last_seq,
      method: 'GET'
    };
    
    
    http
      .get(options, function(res) {
        // clear out the buffer
        buffer = "";
        res.on('data', function (chunk) {
          // as data comes in, add it to the buffer and process it
          buffer += chunk;
          processBuffer(callback);
        });
        res.on('end', function() {
          
          // when the response ends, process the buffer
          processBuffer(callback);
          
          // if nothing blew up, start a new request
          if (!error) {
            watchForChanges(callback);
          }
          
        })
      })
      .on('error', function(e) {
        // if anything went wrong with the request, let us know!
        console.log('Opps, there was an error: ' + e.message);
      });
      
  };

// start watching couch for changes
watchForChanges(function(output) {
  // when changes happen, log them to standard output
  console.log(output);
});



