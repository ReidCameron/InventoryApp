const axios = require('axios').default;
const GoTrue = require('gotrue-js');
exports.handler = async function (event, context) {
  const { identity, user } = context.clientContext;
  console.log(identity);
  console.log(user);
  const body = JSON.parse(event.body)
  const userID = body.user.id;
  const uri = "https://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/users"
  // 'https://inventoryapp-reidcj.netlify.app/.netlify/identity/user'
  //Create user through API
  const ret = await axios.post(uri, {
    access_token: process.env.access_token,
    auth_id: userID,
    first_name: body.user.user_metadata.first_name,
    last_name: body.user.user_metadata.last_name,
  }).then( res => {
    // auth = new GoTrue({
    //   APIUrl: 'https://inventoryapp-reidcj.netlify.app/.netlify/identity',
    //   audience: '',
    //   setCookie: false,
    // });
    // // let user : GoTrue.User;
    // user.update({
    //   app_metadata: {
    //     _id: res.data._id,
    //   }
    // });

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
  return ret;
};
