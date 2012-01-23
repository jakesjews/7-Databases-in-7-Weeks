/***
 * Excerpted from "Seven Databases in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/rwdata for more book information.
***/
Gremlin.addStep("friendsuggest") // (1)
fs_func = { // (2)
  def start;
  _{(start = it) != null}.both('friends').
  except([start]).out('likes').uniqueObject
}
[Pipe,Vertex].each{ // (3)
  it.metaClass.friendsuggest = { Gremlin.compose(delegate, fs_func()) }
}
