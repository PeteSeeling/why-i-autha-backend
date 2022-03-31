const fetch = require('cross-fetch');
const { response } = require('../app');

const exchangeCodeForToken = async (code) => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
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
  });
  const { access_token } = await response.json();
  return access_token;
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
  const githubProfileResp = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  const { login, avatar, email } = await githubProfileResp.json();

  return { username:login,
    avatar,
    email };
  

};

module.exports = { exchangeCodeForToken, getGithubProfile };
