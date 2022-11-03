const axios = require('axios').default;

exports.handler = async function (event, context) {
  // const { identity, user } = context.clientContext;
  console.log("------------RAN VALIDATE------------")
  const body = JSON.parse(event.body)
  const userID = body.user.id;
  const uri = "https://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/users"

  console.log(body);

  //Create user through API
  const ret = await axios.post(uri, {
    access_token: process.env.access_token,
    auth_id: userID,
    full_name: body.user.user_metadata.full_name,
  }).then( res => {
    return {
      statusCode: 200,
      body: JSON.stringify({ Message: "New User Posted" }),
    };
  }).catch( err => {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "User Post Unsuccessful" }),
    };
  });
  console.log("------------END VALIDATE------------")
  return ret;
};
