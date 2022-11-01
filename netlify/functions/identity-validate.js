const axios = require('axios');

exports.handler = async function (event, context) {
  // const { identity, user } = context.clientContext;
  const body = JSON.parse(event.body)
  const userID = body.user.id;
  const uri = "https://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/users"
  console.log("--------User Info--------");
  console.log(userID);
  console.log(body.user.user_metadata.full_name)
  // axios.post(uri, {
  //   auth_id: userID,
  //   full_name: body.user.user_metadata.full_name,
  // }).then( res => {
  //   console.log("It worked")
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({ Message: "New User Posted" }),
  //   };
  // }).catch( err => {
  //   console.log("It broke")
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ Error: "User Post Unsuccessful" }),
  //   };
  // });
    return {
      statusCode: 200,
      body: JSON.stringify({ Message: "New User Posted" }),
    };
};
