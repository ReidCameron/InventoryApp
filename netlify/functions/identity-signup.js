const axios = require('axios');

exports.handler = async function (event, context) {
  // const { identity, user } = context.clientContext;
  const body = JSON.parse(event.body)
  const userID = body.user.id;
  const uri = "https://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/users"

  axios.post(uri, {
    auth_id: userID,
    full_name: body.user.full_name,
  }).then( res => {
    return {
      statusCode: 200,
      body: JSON.stringify({ Message: res.data.Message }),
    };
  }).catch( err => {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "User Post Unsuccessful" }),
    };
  });
};
