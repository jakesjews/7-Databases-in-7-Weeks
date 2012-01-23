/***
 * Excerpted from "Seven Databases in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/rwdata for more book information.
***/
Gremlin.addStep("varietal") // (1)
v_func = { _{it != null}.out('grape_type').uniqueObject }  // (2)
Vertex.metaClass.varietal = { Gremlin.compose(delegate, v_func()) }  // (3)
Pipe.metaClass.varietal = { Gremlin.compose(delegate, v_func()) }
