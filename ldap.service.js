const { Client } = require('ldapts');
const INVALID_CREDENTIALS_ERROR_CODE = 49;
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Invalid credentials';
require("dotenv").config();

class LdapService {
    constructor(domain) {
      this.domain = domain;
        this.ldapClient = new Client({
            url: 'ldap://avisto-eastern.com',
            referrals: 'throw' 
        });
    }

  async connect(username, password){
    try{
        await this.ldapClient.bind(username + '@' + this.domain, password);
        console.log(`isConnected: ${this.ldapClient.isConnected}`);
      }
      catch(error){
        if(error.code == INVALID_CREDENTIALS_ERROR_CODE){
          throw new Error(INVALID_CREDENTIALS_ERROR_MESSAGE + ': ' + this.domain);
        }
        else{
            this.ldapClient.unbind();
            throw error;
        }
      }
  }

  async search(username, password){

    try{
        await this.connect(username, password);
        const searchResult = await this.ldapClient.search('dc=avisto-eastern,dc=com',{
            filter: '(userPrincipalName=' + username + '@' + this.domain + ')',
        });
        console.log(searchResult);
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