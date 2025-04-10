import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }
    
    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                //call another method
                return this.login({email, password})
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error        
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            throw error            
        }
        return null;
    }   

    async logout() {
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            throw error            
        }
    }

}
    
const authService = new AuthService();

export default authService;



// Optimized code for this code

// const client = new Client()
//     .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
//     .setProject('<PROJECT_ID>');                 // Your project ID

// const account = new Account(client);

// const user = await account.create(
//     ID.unique(), 
//     'email@example.com', 
//     'password'
// );

