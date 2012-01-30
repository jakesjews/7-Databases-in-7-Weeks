var good_scope;

good_scope = function(object) {
  var data;
  try {
    data = JSON.parse(object.values[[0]].data);
    if ((data.score != null) || data.score === '') throw 'Score is required';
    if (data.score < 1 || data.score > 4) throw 'Score must be from 1 to 4';
  } catch (error) {
    return {
      "fail": error
    };
  }
  return object;
};
