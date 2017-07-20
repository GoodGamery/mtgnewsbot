/*
    Performs a deep merge of two variables, creating a new object that following these rules:
       For basic types Number, Boolean, and String, object b wins
       Arrays are concatenated
       Object properties with no conflict are taken
       Object properties with a conflict are recursively merged
*/
'use strict';

function deepMerge(a, b) {
    // If b is undefined, assume that we want a
    if (b === undefined) {
        return a;
    }

    // Objects must be of the same type to merge
    if (typeof a !== typeof b) {
        throw new Error("Can't merge objects of different types " + typeof a + " and " + typeof b);
    }

    // If they are strings, numbers, or booleans, the newer one wins
    if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
        return b;
    }

    // If a and be are arrays, concatenate them
    if (Array.isArray(a) && Array.isArray(b)) {
        // console.log(`merge arrays [${a[0]}...${a.length}] and [${b[0]}...${b.length}]`);
        return a.concat(b);
    }

    // If they are objects, merge keys that don't conflict, then recursively merge others
    if (typeof a === 'object' && typeof b === 'object') {
        var newObject = Object.assign({}, a);
        for (var prop in b) {
            if (newObject.propertyIsEnumerable(prop)) {
                // Conflict, both objects have a property, so go one level deeper to reconcile it
                newObject[prop] = deepMerge(newObject[prop], b[prop]);
            } else {
                // No conflict, take the property
                newObject[prop] = b[prop];
            }
        }
        return newObject;
    }

    throw new Error("Can't merge " + a + " and " + b);
}

module.exports = deepMerge;
