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
