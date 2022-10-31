exports.handler = async function (event, context) {
    const { identity, user } = context.clientContext;

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    console.log(`A user initiated a \"${event}\" event at ${time}`)
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello World" }),
    };
  };