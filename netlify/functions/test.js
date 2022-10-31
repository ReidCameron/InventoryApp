exports.handler = async function (event, context) {
  console.log("hello there")
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};