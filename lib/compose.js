const { UnaryContext } = require("./context/context");

function getMethodType(methodDefinition) {
  const requestStream = methodDefinition.requestStream;
  const responseStream = methodDefinition.responseStream;
  if (requestStream && responseStream) {
    return "Duplex";
  }
  if (requestStream) {
    return "ClientStream";
  }
  if (responseStream) {
    return "ServerStream";
  }
  return "Unary";
}

module.exports = function compose(
  { handler, middlewareStack },
  serviceDefinition
) {
  // console.log({ middlewareStack }, { handler });
  // console.log(Object.keys(serviceDefinition));
  // define what type of function this one is...
  const upperCasedName = handler[0].toUpperCase() + handler.substring(1);
  let methodDefinition = serviceDefinition[upperCasedName];
  if (methodDefinition === undefined) {
    throw new Error(`Incorrect method name: ${handler}`);
  }
  const methodType = getMethodType(methodDefinition);

  // console.log(methodType);

  if (typeof middlewareStack === "function") {
    middlewareStack = [middlewareStack];
  }

  switch (methodType) {
    case "xDuplex":
      // class Context {}
      return async function(call, callback) {
        let context = new Context(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          await middlewareStack[i](context);
        }
      };
    case "xClientStream":
      // class Context {}
      return async function(call) {
        let context = new Context(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          await middlewareStack[i](context);
        }
      };
    case "xServerStream":
      // class Context {}
      return async function(call, callback) {
        let context = new Context(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          await middlewareStack[i](context);
        }
      };
    case "xUnary":
      return function(call, callback) {
        console.log("inside of unary");
        let context = new UnaryContext(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          middlewareStack[i](context);
        }
      };
    default:
      return function(call, callback) {
        console.log("inside of unary");
        let context = new UnaryContext(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          middlewareStack[i](context);
        }
      };
  }
};

//needs to know exactly what type of thing we are passing in...

//need a method that will take each call and pass it to each of them...

// also at any time need to be able to throw the proper errors...

// Takes in an object of a variety of

// array of middleware
//first it has to understand what types of middleware we are passing in... is it unary call or not?
// {
//   unaryCallName: [middleware, handler];
// }
// take in the array or function they passed
// return the wrapped handler
// we would compose each rpc method, and add service where the method names map to our wrapper functions
// compose ()
// compose needs to be aware of the type of call, because the wrapped function will provide a different object as context, depending on the call type
// we will have access to the name of the rpc method (camelcased)
// find the rpc method in the proto package, access it's call type (not camelcased)
// proto package