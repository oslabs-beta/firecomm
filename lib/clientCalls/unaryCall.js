const generateMeta = require("../utils/generateMeta");

/** 
 * @class 
 * A Unary Call class. Extends the ServerUnaryCall object properties and methods from gRPC-Node, thus all native methods and properties are still available on the call object.
 * 
 * @example const unaryHandler = function(call) {
  console.log(call.req.meta);
  call.setMeta({
    'myProperty':'myValue'
  });
  call.send({
    message: "Hello world"
  })
}
 * 
 * @property 
 * `.req` function // an object containing information sent from the client
properties 
 * `meta` object // an object containing the unary request metadata sent from the client 
   `body` object // an object containing the unary request body sent from the client
 *  
 * @method `.setMeta( METADATA )` 
 Sets metadata to be sent with the response. Takes in a JSON object of keys and values.
 * @param {Object} METADATA
 * @property {String} any 
 * @example const unaryHandler = function(call) {
 call.setMeta({
   'myProperty':'myValue'
 });
 }
 * @returns undefined
 * 
 * @method `.throw( ERROR )`
 Ends the request-response cycle and sends Error message to the client.
 * @param {Error} Error
 * @example const clientStreamHandler = function(call) {
  call.throw(new Error('My error message.'))
 }
 * @returns Undefined
 * 
 * @method `.setStatus( METADATA ) `
 Adds metadata in the trailers associated with an error message.
 NOTE: Must be called before .throw();
 * @param {Object} METADATA
 * @property {String} any 
 * @example const clientStreamHandler = function(call) {
   call.setStatus({
     'details':'Error details here.'
   })
   call.throw(new Error('My error message.'))
 }
 * @returns Undefined 
 * 
 * @method `.send( MESSAGE )` 
  Ends the request-response cycle, data is passed in through the parameter.
 * @param {Object} MESSAGE // an object matching the keys and properties of your gRPC method types.
 * @example const unaryHandler = function(call) {
  call.send( { greeting: "Hello World." } )
}
 * @returns Undefined
 * 
 */

module.exports = function unaryCall(that, methodName, ...args) {
  if (typeof args[0] !== "object") {
    throw new Error("First parameter required and must be of type: Message.");
  }
  let message = args[0];
  let interceptors = undefined;
  let metadata = undefined;
  let callback = undefined;
  let promise = true;
  args = args.filter(arg => args !== undefined);
  for (let i = 1; i < args.length; i++) {
    if (typeof args[i] === "function") {
      callback = args[i];
      promise = false;
    } else {
      if (typeof (args[i] === "object")) {
        if (Array.isArray(args[i])) {
          interceptors = { interceptors: args[i] };
        } else {
          metadata = generateMeta(args[i]);
        }
      }
    }
  }
  if (promise) {
    return new Promise((resolve, reject) => {
      that[methodName](message, metadata, interceptors, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  } else {
    return that[methodName](message, metadata, interceptors, callback);
  }
};
// message interceptors

// []

//

// if callback is undefined... there are sevral cases

//no interceptors, no metaObject

//if second parameter is either function, array, or object
//

//you have access to the methodtype

// unaryExpression

// client

// (metaObject, interceptorArray, callback)

// server
// message, metaObject, interceptorArray

// suplex

// metaObject, interceptorArray
