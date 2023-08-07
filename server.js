const express = require('express');
const cors = require('cors');
const LdapService = require('./ldap.service');
const {API_ENDPOINT, INTERNAL_SERVER_ERROR_CODE} = require('./constants.ts');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

const ldapService = new LdapService(process.env.USERDNSDOMAIN);

// API endpoint to handle LDAP operations
app.post(API_ENDPOINT, async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await ldapService.search(username, password);
    res.json({'emailAddress': result.searchEntries[0].mail, 'role': result.searchEntries[0].memberOf});
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ error: error.message });
  }
});

app.listen(port, () => {

});