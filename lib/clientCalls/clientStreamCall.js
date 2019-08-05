const generateMeta = require("../utils/generateMeta");

// (metaObject, interceptorArray, callback)

/**
 * @class A Client-Streaming Call class. Extends the ServerReadableStream object properties and methods from gRPC-Node, thus all native methods and properties are still available on the call object.
 * 
 * @example const clientStreamHandler = function(call) {
  console.log(call.req.meta);
  call.setMeta({
    'myProperty':'myValue'
  });
  call.send({
    message: "Hello world"
  })
}
 * 
 * @method .setMeta( METADATA ) 
Sets metadata to be sent with the response. Takes in a JSON object of keys and values.
* @param {Object} METADATA
* @property {String} any 
* @example const clientStreamHandler = function(call) {
call.setMeta({
  'myProperty':'myValue'
});
}
* @returns undefined
*
*
* @method .throw( ERROR )
Ends the request-response cycle and sends Error message to the client.
* @param {Error} Error
* @example const clientStreamHandler = function(call) {
 call.throw(new Error('My error message.'))
}
* @returns Undefined
*
*
* @method .setStatus( METADATA ) 
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
* @method .on( EVENT, CALLBACK ) 
Inherited from the Readable stream object from Node.js. First parameter is a string indicating the event type like "data", second parameter is a callback to handle emitted data.
* @param {String} EVENT
* @param {function} CALLBACK
* @example const clientStreamHandler = function(call) {
  call.on("data",(data)=>{
    console.log(data);
});
* @returns Undefined
*
*
*/


module.exports = function clientStreamCall(that, methodName, ...args) {
  let interceptors = undefined;
  let metadata = undefined;
  let callback = undefined;
  let hasFunction = false;
  args = args.filter(arg => args !== undefined);
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === "function") {
      callback = args[i];
      hasFunction = true;
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
  if (!hasFunction) {
    throw new Error("Must include a callback function to client Stream Call");
  }
  return that[methodName](metadata, interceptors, callback);
};
