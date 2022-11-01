const axios = require('axios').default;

exports.handler = async function (event, context) {
  // const uri = "https://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/users"
  // https://inventoryapp-reidcj.netlify.app/.netlify/functions/deleteUser
  const { identity, user } = context.clientContext;
  const userID = user.sub;
  const userUrl = `${identity.url}/admin/users/{${userID}}`;
  const adminAuthHeader = `Bearer ${identity.token}`;

  console.log(identity);
  console.log(user);

  return {
    statusCode: 200,
    body: JSON.stringify({ Message: "Debug" }),
  }

  //Create user through API
  const ret = await axios.delete(userUrl, {
    headers : {Authorization : adminAuthHeader}
  }).then( res => {
    return {
      statusCode: 200,
      body: JSON.stringify({ Message: "User Deleted" }),
    }
  }).catch(err => {
    return {
      statusCode: 400,
      body: JSON.stringify({ Message: err + "" }),
    }
  })

  return ret;
};
