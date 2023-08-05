const { Client, UnknownStatusCodeError, ServerSideSortingRequestControl } = require('ldapts');
const INVALID_CREDENTIALS_ERROR_CODE = 49;
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Invalid credentials';

class LdapService {

    constructor() {
        this.ldapClient = new Client({
            url: 'ldap://avisto-eastern.com',
            referrals: 'throw' 
        });
    }

  async connect(username, password, domain){
    try{
        await this.ldapClient.bind(username + '@' + domain, password);
        console.log(`isConnected: ${this.ldapClient.isConnected}`);
      }
      catch(error){
        if(error.code == INVALID_CREDENTIALS_ERROR_CODE){
          throw new Error(INVALID_CREDENTIALS_ERROR_MESSAGE);
        }
        else{
            this.ldapClient.unbind();
            throw error;
        }
      }
  }

  async search(username, password, domain){
    try{
        await this.connect(username, password, domain);
        const searchResult = await this.ldapClient.search('dc=avisto-eastern,dc=com',{
            filter: '(userPrincipalName=' + username + '@' + domain + ')',
        });

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