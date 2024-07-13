interface UserPoolRole {
    [key: string]: string[];
  }
  


export const USERPOOL_ROLE: UserPoolRole ={
    end_user_pool: ["user"],
    admin_user_pool: ["admin"]
} 