(v) ->
    parsed_data = JSON.parse(v.values[0].data)
    floor = Math.floor( v.key / 100 )
    room = {}
    room[floor] = parsed_data.capacity
    return [room]
