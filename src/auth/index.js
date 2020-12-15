const admin = require("firebase-admin");
const errorsDictionary = require("../users/errorsDictionary")

//const functions = require("firebase-functions");

function decodeBearer(bearer) {
    return bearer ? bearer.split(" ")[1]: '';  
}

function validateToken(token){
    console.log('validate token', token, '\n')
    return admin.auth().verifyIdToken(token);
}

module.exports.getContext = async ({ req, res }) => {
    
    const chomp = req.cookies.chomp || "";
    console.log('check chomp:\n', req.cookies)
    const authToken = decodeBearer(req.headers.authorization);
    let user = {};
    if (chomp) {
        console.log('chomp available!')
        user = await verifyCookie(chomp);
    } else if (authToken) {
      try {
        //user = await validateToken(authToken);
        const cookie = await setUserCookie(authToken, res).then(
          //probably not necessary, as result is same as validateToken? need to test
          async (sessionCookie) => {
            // Set cookie policy for session cookie.
            const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
            const options = { maxAge: expiresIn, httpOnly: true, secure: true };
            if (process.env.NODE_ENV === "development") {
              //we don't have https in localhost for now
              options.secure = false;
            }
            res.cookie("chomp", sessionCookie, options);
            user = await validateToken(authToken);
          },
          (error) => {
            console.log("setUserCookie Error: ", error);
            //res.status(401).send('UNAUTHORIZED REQUEST!');
          }
        );

        /*
                    Sample payload
                    user {
                        iss: 'https://securetoken.google.com/mokuroku-staging',
                        aud: 'mokuroku-staging',
                        auth_time: 1607383827,
                        user_id: '3zbNQqHUuphG1f0dJHoSmnTZawG3',
                        sub: '3zbNQqHUuphG1f0dJHoSmnTZawG3',
                        iat: 1607383828,
                        exp: 1607387428,
                        email: 'irist@iris.com',
                        email_verified: false,
                        firebase: { identities: { email: [Array] }, sign_in_provider: 'password' },
                        uid: '3zbNQqHUuphG1f0dJHoSmnTZawG3'
                    }
                    */
      } catch (error) {
        console.error("Error on auth", error);
      }
    } 
    console.log('valid user', user)
    return user;
};

const setUserCookie = (idToken)=>{
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    return admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    
}

const verifyCookie = (verifySessionCookie)=>{
    return admin
      .auth()
      .verifySessionCookie(verifySessionCookie, true /** checkRevoked */)
      .catch((error) => {
        // Session cookie is unavailable or invalid. Force user to login.
        console.log('Error on verify cookie', error)
        throw new Error(errorsDictionary.USER_UNKNOWN);
      });
}

module.exports.requireUser = (args, context, resolverAction) => {
  if (context && context.uid) {
    return resolverAction(args, context);
  }
  else{
      throw new Error(errorsDictionary.USER_UNKNOWN);
  }
};

module.exports.requireGuestUser = (args, context, resolverAction) => {
  if (!context || !context.uid) {
    return resolverAction(args, context);
  }
  else{
      throw new Error(errorsDictionary.USER_UNKNOWN);
  }
};

module.exports.validateToken = validateToken;
module.exports.verifyCookie = verifyCookie;
