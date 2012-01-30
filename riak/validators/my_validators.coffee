good_scope = (object) ->
    try
        # From the Riak object, pull data and parse it as JSON
        data = JSON.parse( object.values[[0]].data )
        # If score is not found, fail here
        throw 'Score is required' if data.score? or data.score is ''
        # If score is not within range, fail here
        throw 'Score must be from 1 to 4' if data.score < 1 or data.score > 4
    catch error
        # Riak expects the following JSON if a failure occurs
        return { "fail" : error }
    return object


