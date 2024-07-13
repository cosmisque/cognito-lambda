/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AdminCreateUserCommand,
  ListUsersCommand,
  AdminDeleteUserCommand,
  ListUserPoolsCommand,
  AdminUpdateUserAttributesCommand,
  AdminInitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AdminSetUserPasswordCommand,
  AdminGetUserCommand,
  DescribeUserPoolCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const AWS_ADMIN_CLIENT_ID = "5kpdgff9n82t8fkuj4fukg2sd8";
const AWS_ADMIN_USER_POOL_ID = "ap-southeast-1_EkmsQuW6f";

const client = new CognitoIdentityProviderClient({
  region: "ap-southeast-1",
});


function getCookieExpirationDate(days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  return date.toUTCString();
}

export const asyncHandler = (lambdaHandler) => {
  return async (event, context) => {
    try {
      const result = await lambdaHandler(event, context);
      return result;
    } catch (error) {
      console.log(error.message);
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }
  };
};

const mapUserAttributes = (users) => {
  const res = users.map((user) => {
    const attributes = {};
    user.Attributes.forEach((attribute) => {
      attributes[attribute.Name] = attribute.Value;
    });
    return {
      ...attributes,
      username: user.Username,
      email: attributes.email,
      enabled: user.Enabled,
      createDate: user.UserCreateDate,
      lastModifiedDate: user.UserLastModifiedDate,
      status: user.UserStatus,
    };
  });
  return res;
};

export const createUser = asyncHandler(async (event, context) => {
  const body = JSON.parse(event.body);
  const { userPoolId, username, email, sendEmail, customAttributes } = body;
  let userAtt = [
    {
      Name: "email",
      Value: email,
    },
  ];
  if (customAttributes) {
    userAtt.push(...customAttributes);
  }

  let input = new AdminCreateUserCommand({
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: userAtt,
    ...(!sendEmail && { MessageAction: "SUPPRESS" })

  });
  if (sendEmail) {
    input.DesiredDeliveryMediums = ["EMAIL"];
  }

  const response = await client.send(input);
  const result = {
    statusCode: 200,
    body: JSON.stringify({ message: "User successfully created" }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});

export const listUserPools = asyncHandler(async (event, context) => {
  const response = await client.send(new ListUserPoolsCommand());
  const { UserPools: userPools } = response;

  const result = {
    statusCode: 200,
    body: JSON.stringify(userPools),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});

export const listUsersInPool = asyncHandler(async (event, context) => {
  const queryParams = event.queryStringParameters;
  const { userPoolId, field } = queryParams;

  const response = await client.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
    })
  );

  const { Users: users } = response;
  const mappedUsers = mapUserAttributes(users);

  const result = {
    statusCode: 200,
    body: JSON.stringify(mappedUsers),

    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});

export const deleteUser = asyncHandler(async (event, context) => {
  const body = JSON.parse(event.body);
  const { userPoolId, username } = body;
  const response = await client.send(
    new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    })
  );

  const result = {
    statusCode: 200,
    body: JSON.stringify({ message: "User successfully deleted" }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };

  return result;
});

export const updateUser = asyncHandler(async (event, context) => {
  const body = JSON.parse(event.body);
  const { userPoolId, username, userAttributes } = body;
  const response = await client.send(
    new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: userAttributes,
    })
  );

  const result = {
    statusCode: 200,
    body: JSON.stringify({ message: "User successfully updated" }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});

export const getUser = asyncHandler(async (event, context) => {
  const queryParams = event.queryStringParameters;
  const { userPoolId, username } = queryParams;
  const response = await client.send(
    new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    })
  );

  const result = {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});

export const getUserPoolAttributes = asyncHandler(async (event, context) => {
  const { userPoolId } = event.queryStringParameters;

  const { UserPool } = await client.send(
    new DescribeUserPoolCommand({ UserPoolId: userPoolId })
  );
  const customAttributes = UserPool.SchemaAttributes.filter((attribute) =>
    attribute.Name.startsWith("custom:")
  ).map((filteredAtt) => filteredAtt.Name);

  const result = {
    statusCode: 200,
    body: JSON.stringify({ data: customAttributes }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});

export const activateAdminUser = asyncHandler(async (event, context) => {
  const body = JSON.parse(event.body);
  const { username, clientId, password, newPassword } = body;
  let result;

  const input = new AdminInitiateAuthCommand({
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    ClientId: AWS_ADMIN_CLIENT_ID,
    UserPoolId: AWS_ADMIN_USER_POOL_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const response = await client.send(input);
  if (!response.ChallengeName) {
    // already activated etc...
    result = {
      statusCode: 400,
      body: JSON.stringify({ message: "Error activating user account" }),
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }

  const challengeResponseData = await client.send(
    new RespondToAuthChallengeCommand({
      ChallengeName: response.ChallengeName,
      ClientId: clientId,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
      },
      Session: response.Session,
    })
  );

  result = {
    statusCode: 200,
    body: JSON.stringify({ message: "User account successfully activated" }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});




export const login = asyncHandler(async (event, context) => {
  const body = JSON.parse(event.body);
  const { username, password } = body;
  const input = new AdminInitiateAuthCommand({
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    ClientId: AWS_ADMIN_CLIENT_ID,
    UserPoolId: AWS_ADMIN_USER_POOL_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const response = await client.send(input);

  if (!response.ChallengeName) {
    const {
      AuthenticationResult: { IdToken, AccessToken, RefreshToken },
    } = response;
    const expires = getCookieExpirationDate(60);
    return {
      statusCode: 200,
      body: JSON.stringify({ IdToken, AccessToken }),
      headers: {
        "Set-Cookie":  `idt=${RefreshToken};Expires=${expires};Secure;SameSite=None;HttpOnly;Path=/` ,
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } else {
    return {
      statusCode: 400,
      body: ({ message: "Account not activated" }),
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
});


export const refresh = asyncHandler(async (event, context) => {
  const token = event.headers?.Cookie?.replace("idt=", "")
  if(!token ){
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Invalid refresh token' }),
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
        "Set-Cookie": "idt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;Secure;SameSite=None;HttpOnly;Path=/"

      },
    };

  }

  const input = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.REFRESH_TOKEN,
    ClientId: AWS_ADMIN_CLIENT_ID,
    UserPoolId: AWS_ADMIN_USER_POOL_ID,
    AuthParameters: {
        "REFRESH_TOKEN": token,
    },
  });

  const response = await client.send(input);
  const {
    AuthenticationResult: { IdToken, AccessToken },
  } = response;
  
  return {
    statusCode: 200,
    body: JSON.stringify({ IdToken, AccessToken }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
});



export const validate = asyncHandler(async (event, context) => {
  const result = {
    statusCode: 200,
    body: JSON.stringify({ message: "User token successfully validated" }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return result;
});


export const logout = asyncHandler(async (event, context) => {
  const result = {
    statusCode: 200,
    body: JSON.stringify({ message: "Successfully logout" }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
      "Set-Cookie": "idt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;Secure;SameSite=None;HttpOnly;Path=/"
    },
  };
  return result;
});

