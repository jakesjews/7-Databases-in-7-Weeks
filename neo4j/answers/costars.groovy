/***
 * Excerpted from "Seven Databases in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/rwdata for more book information.
***/
Gremlin.addStep("costars")
costars_func = {
  _{start = it}.outE('ACTED_IN').inV.
  inE('ACTED_IN').outV{
    !it.object.equals(start)
  }
}
[Pipe,Vertex].each{
  it.metaClass.costars = { Gremlin.compose(delegate, costars_func()) }
}
