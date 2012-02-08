// Find all countries that do not export tasty bacon
// Not the same as countries that export bacon which is not tasty

db.countries.find({
    'exports.foods' : {
        $not : {
            $elemMatch : {
                name  : 'bacon',
                tasty : true 
            }
        }
    }
})
