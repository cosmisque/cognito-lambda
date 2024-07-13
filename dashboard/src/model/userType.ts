export interface UserAttributes {
    "custom:role_name": string
   }
   
export interface UpdateUser {
    userPoolId: string, 
    username: string, 
    userAttributes: UserAttributes
}


export interface IUserPool {
    CreationDate: Date
    Id: string,
    LambdaConfig: object,
    LastModifiedDate: Date,
    Name: string
}


export interface LoginApiResponse {
    IdToken: string;
    AccessToken: string;
    error?: string
  } 


 export interface ICreateUser {
    username: string;
    email: string;
    customAttributes?: { Name: string; Value: any; }[]
    'custom:role_name': string;
    userPoolId?: string
    sendEmail?: boolean
  }
  

  export interface UsersApiResponse {
    sub: string,
    'custom:role_name':string,
    email: string,
    username: string,
    enabled: boolean,
    createDate: Date ,
    lastModifiedDate: Date,
    status: string
  }
  