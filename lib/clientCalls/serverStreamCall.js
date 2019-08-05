const generateMeta = require("../utils/generateMeta");

// server
// message, metaObject, interceptorArray

/**
 * @class A `Server-Streaming Call class`. Extends the ServerWritableStream object properties and methods from gRPC-Node, thus all native methods and properties are still available on the call object. 
 * @example const serverStreamHandler = function(call) {
  console.log(call.req.meta);
  call.sendMeta({
    'myProperty':'myValue'
  });
  call.write({
    message: "Hello world"
  })
} 
 * @property 
 * `.req` function // an object containing information sent from the client
properties 
 * `meta` object // an object containing the unary request metadata sent from the client 
   `body` object // an object containing the unary request body sent from the client
 * 
 * @method .sendMeta( METADATA ) 
 Sends metadata to the client. Takes in a JSON object and converts it into gRPC metadata.
 * @param {Object} METADATA
 * @property {String} any 
 * @example const serverStreamHandler = function(call) {
 call.setMeta({
   'myProperty':'myValue'
 });
 }
 * @returns undefined
 * 
 * @method `.write( MESSAGE )`
Writes a message to the writable stream. Message should match the message type for the gRPC server-streaming method the handler is written for.
 * @param {Object} MESSAGE object following the format of the message definition in your .proto file 
 * @example const serverStreamHandler = function(call) {
  call.write({
    greeting: "Hello world."
  })
 * @returns Undefined
 *
 * @method `.throw( ERROR )`
 Ends the request-response cycle and sends Error message to the client.
 * @param {Error} Error
 * @example const serverStreamHandler = function(call) {
  call.throw(new Error('My error message.'))
 }
 * @returns Undefined
 *
 *
 * @method `.setStatus( METADATA )` 
 Adds metadata in the trailers associated with an error message.
 NOTE: Must be called before .throw();
 * @param {Object} METADATA
 * @property {String} any 
 * @example const serverStreamHandler = function(call) {
   call.setStatus({
     'details':'Error details here.'
   })
   call.throw(new Error('My error message.'))
 }
 * @returns Undefined
 * 
 * 
 * @method `.emit( EVENT, DATA )` 
Inherited from the Duplex stream object from Node.js. First parameter is a string indicating the event type like "data", second parameter is the data to be written to the stream.
 * @param {String} EVENT a string representing the event type
 * @param {any} DATA data to be written to the stream
 * @example const serverStreamHandler = function(call) {
  call.emit("customEvent",{
    eventData: "Hello world"
  }); 
 * @returns Undefined 
 *  
 */

module.exports = function serverStreamCall(that, methodName, ...args) {
  // console.log(args);
  if (typeof args[0] !== "object") {
    throw new Error("First parameter required and must be of type: Message.");
  }
  let message = args[0];
  let interceptors = undefined;
  let metadata = undefined;
  args = args.filter(arg => args !== undefined);
  // if (args.length) {
  //   while (args[args.length - 1] === undefined) {
  //     args.pop();
  //   }
  // }
  for (let i = 1; i < args.length; i++) {
    if (typeof (args[i] === "object")) {
      if (Array.isArray(args[i])) {
        interceptors = { interceptors: args[i] };
      } else {
        metadata = generateMeta(args[i]);
      }
    }
  }
  // console.log({ metadata });
  return that[methodName](message, metadata, interceptors);
};
