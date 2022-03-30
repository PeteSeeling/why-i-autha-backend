const fetch = require('cross-fetch');
const { response } = require('../app');

const exchangeCodeForToken = async (code) => {
  const response = await fetch(''), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  }
  const { access_token } = await response.json();
  return access_token;

  // TODO: Implement me!

};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
};

module.exports = { exchangeCodeForToken, getGithubProfile };
