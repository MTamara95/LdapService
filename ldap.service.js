const { Client } = require('ldapts');
const { INVALID_CREDENTIALS_ERROR_CODE, INVALID_CREDENTIALS_ERROR_MESSAGE, ACTIVE_DIRECTORY_USERNAME} = require('./constants.ts');

class LdapService {
    constructor(domain) {
      this.domain = domain;
      this.ldapClient = new Client({ url: `ldap://${this.domain}`});
    }

  async connect(username, password){
    try{
        await this.ldapClient.bind(`${username}@${this.domain}`, password);
      }
      catch(error){
        if(error.code == INVALID_CREDENTIALS_ERROR_CODE){
          throw new Error(INVALID_CREDENTIALS_ERROR_MESSAGE);
        }
        else{
            throw error;
        }
      }
  }

  async search(username, password){
    try{
        await this.connect(username, password);

        const searchResult = await this.ldapClient.search(
          // separate domain components - eg: 'avisto-eastern.com' -> 'dc=avisto-eastern,dc=com'
          this.domain.split('.').map(e => `dc=${e}`).join(','),
          {
            filter: `(${ACTIVE_DIRECTORY_USERNAME}=${username}@${this.domain})`
          }
        );

        return searchResult;
    }
    catch(error){
        throw error;
    }
    finally{
        this.ldapClient.unbind();
    }
  }
}

module.exports = LdapService;