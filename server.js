const express = require('express');
const LdapService = require('./ldap.service');

const app = express();
const port = 3000;
const cors = require('cors');

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

const ldapService = new LdapService(process.env.USERDNSDOMAIN);

// API endpoint to handle LDAP operations
app.post('/api/ldap/search', async (req, res) => {
  const { username, password, domain } = req.body;

  try {
    const result = await ldapService.search(username, password, domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
