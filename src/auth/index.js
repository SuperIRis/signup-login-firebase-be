const admin = require("firebase-admin");
const { errorsDictionary } = require("@mokuroku/mokuroku-commons/dictionaries/errors");
const { SUCCESS_STATUS, ERROR } = require("@mokuroku/mokuroku-commons/dictionaries/statuses");

//const functions = require("firebase-functions");
let serverResponse;
function decodeBearer(bearer) {
    return bearer ? bearer.split(" ")[1]: '';  
}

function validateToken(token){
    return admin.auth().verifyIdToken(token);
}

async function getContext ({ req, res }) {
    serverResponse = res;
    const __session = req.cookies.__session || "";
    //console.log('check __session:\n', req.cookies)
    const authToken = decodeBearer(req.headers.authorization);
    let user = {};
    if (__session) {
      user = await verifyCookie(__session);
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
            res.cookie("__session", sessionCookie, options);
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
        return error;
      }
    } 
    //console.log('valid user', user)
    return user;
};

function setUserCookie (idToken){
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    return admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    
}

function verifyCookie (verifySessionCookie){
    return admin
      .auth()
      .verifySessionCookie(verifySessionCookie, true /** checkRevoked */)
      .catch((error) => {
        // Session cookie is unavailable or invalid. Force user to login.
        console.log('cookie:', verifySessionCookie)
        console.log('Error on verify cookie, did you properly logout while debugging?', error)
        clearCookie();
        throw new Error(errorsDictionary.USER_UNKNOWN);
      });
}

function clearCookie(){
  try {
    serverResponse.clearCookie("__session");
  } catch (error) {
    return {status: ERROR, message:errorsDictionary.USER_UNKNOWN}
  }
  return { status: SUCCESS_STATUS };
}

//returns promise after validating a token
module.exports.validateToken = validateToken;
//verify Session Cookie with firebase
module.exports.verifyCookie = verifyCookie;
//used by ApolloServer to define context of the app. Runs on every request
module.exports.getContext = getContext;
//clean cookie for logout
module.exports.clearCookie = clearCookie;