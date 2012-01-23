(v) ->
    parsed_data = JSON.parse(v.values[0].data)
    data = {}
    data[parsed_data.style] = parsed_data.capacity
    return [data]
