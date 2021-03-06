const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })

  .get('/login/callback', async (req, res) => {
    const { code } = req.query;
    // * exchange code for token
    const token = await exchangeCodeForToken(code);
    // * get info from github about user with token
    const githubProfile = await getGithubProfile(token);
    // * get existing user if there is one
    let user = await GithubUser.findByUsername(githubProfile.login);
    // * if not, create one
    if(!user){
      user = await GithubUser.insert({ ...githubProfile, username:githubProfile.login, avatar: githubProfile.avatar_url });
      // * create jwt
      // * set cookie and redirect
    }
    const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn:'1 day' });

    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
      })
      .redirect('/api/v1/github/dashboard');
  })

  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
