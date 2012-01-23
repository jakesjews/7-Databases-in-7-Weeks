(rooms) ->
    totals = {}
    for room of rooms
        for floor of rooms[room]
            if totals[floor]
                totals[floor] += rooms[room][floor]
            else
                totals[floor] = rooms[room][floor]
    return [totals]
