/***
 * Excerpted from "Seven Databases in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/rwdata for more book information.
***/
var
  neo4j = require('neo4j'),
  csv = require('csv');
  http = require('http'),
  redis = require("redis"),
  total_lines = null,
  processed_lines = 0,
  line_number = 0,
  tsv_file_name = 'group_membership.tsv',
  couch_database_name = 'bands';

// set the max sockets open at once. throttle it down from
// 5 to give some time for used sockets to release
http.Agent.defaultMaxSockets = 3;

var couch_client = http.createClient(5984, 'localhost'),
    redis_client = redis.createClient();

// create couch database
console.log('creating couch database: ' + couch_database_name);
couch_client.request('PUT', '/'+couch_database_name).end();


// open up the TSV file and iterate through ever line
csv()
.fromPath(tsv_file_name, {delimiter: '\t', quote: ''})
.on('data',function(data,index)
{
  line_number++;

  var band = data[3];
  var artist = data[2];

  var roles = data[4].split(',');
  if(roles.length === 1 && roles[0] === '') roles = [];
  var doc = {name: band, members: [{name: artist, roles: roles}]};

  band = band.replace(/[\t \?\#\\\-\+\.\,'"()*&!\/]+/g, '_')
             .replace(/^_+/, '');

  if(band === "" || artist === "") {
    trackLineCount();
    return true;
  }

  putDoc('/'+couch_database_name+'/'+band, doc, line_number);

}).on('end',function(count)
{
  total_lines = count;

  if(processed_lines >= total_lines) {
    console.log('Total Lines Processed: ' + processed_lines);
    redis_client.quit();
  }
}).on('error',function(error)
{
  console.log(error.message);
});



// Increment total lines processed and print out every 1000
function trackLineCount(redis_key)
{
  processed_lines++;
  
  // output once every 1000 lines
  if(processed_lines % 1000 === 0) {
    console.log('Lines Processed: ' + processed_lines);
  }

  if(total_lines !== null && processed_lines >= total_lines) {
    console.log('Total Lines Processed: ' + processed_lines);
    // close the Redis Client when complete
    redis_client.quit();
  }

  // this should eventually write
  if(!!redis_key) {
    redis_client.set(redis_key, 1);
  }
}

// PUT a value into CouchDB
function putDoc(url, doc, line_number)
{
  // check if a line was already written to the couch db
  redis_client.get(line_number, function(err, reply)
  {
    if(reply === null) 
    {
      var request = couch_client.request('PUT', url);
      request.end(JSON.stringify(doc));

      // if this fails, there is a version conflict. try again
      request.on('response', function(response)
      {
        if (response.statusCode == 201) {
          trackLineCount(line_number);
        }
        else if(response.statusCode == 409 || response.statusCode == 412) {
          mergeDocs(url, doc, line_number);
        }
        else {
          console.log('HEADERS: ' + JSON.stringify(response.headers));
        }
      }).on('error', function(e) {
        console.log('Opps, there was an error: ' + e.message);
      });

    } else {
      // already set... skip
      trackLineCount(line_number);
    }
  });
}

// Merge an existing CouchDB document with this new document
function mergeDocs(url, doc, line_number)
{
  // TODO: this GET may be avoidable...?
  var get = couch_client.request('GET', url);
  get.on('response', function(response) 
  {
    var buffer = "";
    response.on('data', function(chunk) {
      // as data comes in, add it to the buffer
      buffer += chunk;
    });
    response.on('end', function() {
      if(buffer === '') return;

      var updated_doc = JSON.parse(buffer);

      if(typeof updated_doc["members"] === 'undefined' ||
        updated_doc["members"] === null)
      {
        updated_doc["members"] = [];
      }

      updated_doc["members"].push( doc['members'].pop() );

      putDoc(url, updated_doc, line_number);

    }).on('error', function(e) {
      console.log('Opps, there was an error: ' + e.message);
    });

  }).on('error', function(e) {
    console.log('Opps, there was an error: ' + e.message);
  });
  get.end();
}
