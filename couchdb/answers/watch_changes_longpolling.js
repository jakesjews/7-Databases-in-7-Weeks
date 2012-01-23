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
  
  // last seen sequence number
  last_seq = 0,
  
  // watch couch for changes, call callback when they happen
  watchForChanges = function(callback) {
    
    // options for the request
    var options = {
      host: 'localhost',
      port: 5984,
      path: '/music/_changes?feed=longpoll&since=' + last_seq,
      method: 'GET'
    };
    
    http
      .get(options, function(res) {
        // create a buffer to hold respones data
        var buffer = "";
        res.on('data', function (chunk) {
          // as data comes in, add it to the buffer
          buffer += chunk;
        });
        res.on('end', function() {
          
          // when the response is finished, parse the buffer
          var output = JSON.parse(buffer);
          
          // determine the new last sequence number for next call
          last_seq = output.last_seq || last_seq;
          
          // pass the output object through to the callback
          callback(output);
          
          // if nothing blew up, start a new request
          if (!output.error) {
            watchForChanges(callback);
          }
          
        })
      })
      .on('error', function(e) {
        // if something went wrong with the request, tell us!
        console.log('Oops, something went wrong: ' + e.message);
      });
      
  };

// start watching couch for changes
watchForChanges(function(output) {
  // when changes happen, output them to standard output
  console.log(output);
});



