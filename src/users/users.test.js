const { errorsDictionary } = require("@mokuroku/mokuroku-commons/dictionaries/errors");
const admin = require("firebase-admin");
const auth = require("../auth");
const firebaseMocks = require("../../tests-setup/firebase-mocks");
const {users, user, currentUser} = require('./queries');
auth.clearCookie = jest.fn();
const {addUser, deleteUser, logoutUser} = require('./mutations');

describe('Users Queries', () => {  
  jest.spyOn(admin, "firestore").mockImplementation(() => firebaseMocks.firestore);
  jest.spyOn(admin, "auth").mockImplementation(() => firebaseMocks.auth);
    
  it("Get a list of all users ", (done) => {
    users().then((usersData) => {
      expect(usersData).toHaveLength(2);
      done();
    });
  });

  it("Get a single user from ID ", (done) => {
    user(null, { id: 1 }).then((userData) => {
      expect(userData).toHaveProperty("username");
      done();
    });
  });

  it("Get current user", (done) => {
    currentUser(null, { idToken: 123 }).then((userData) => {
      expect(userData).toHaveProperty("username");
      done();
    });
  });
});

describe('Users Mutations', () => {
  const userRepeatedEmail = { email:'iris-test@iris.com', fullName:'Iris V', username:'superiris-test2', country:'Mexico', birthDate:'1982-08-26' };
  const userRepeatedUsername = { email:'iris-test2@iris.com', fullName:'Iris V', username:'superiris-test', country:'Mexico', birthDate:'1982-08-26' };
  const userUnique= { email:'iris-test3@iris.com', fullName:'Iris V', username:'superiris-test3', country:'Mexico', birthDate:'1982-08-26' };
  const context = {uid:'123', firebase:{}};
  it("Add user: Throws error if email is not in the right format", (done) => {
    addUser(null, { ...userUnique, email: "lol" }, context)
      .then((userData) => {
        throw new Error("user created");
      })
      .catch((err) => {
        expect(err.message).toEqual(expect.stringContaining(errorsDictionary.PAYLOAD_WRONG_FORMAT));
        done();
      });
  });
  it("Add user: Throws error if full name is not in the right format", (done) => {
    addUser(null, { ...userUnique, fullName: "1" }, context)
      .then((userData) => {
        throw new Error("user created");
      })
      .catch((err) => {
        expect(err.message).toEqual(expect.stringContaining(errorsDictionary.PAYLOAD_WRONG_FORMAT));
        done();
      });
  });
  it("Add user: Throws error if username is not in the right format", (done) => {
    addUser(null, { ...userUnique, username: "123" }, context)
      .then((userData) => {
        throw new Error("user created");
      })
      .catch((err) => {
        expect(err.message).toEqual(expect.stringContaining(errorsDictionary.PAYLOAD_WRONG_FORMAT));
        done();
      });
  });
  it("Add user: Throws error if user's email already exists", (done) => {
    addUser(null, userRepeatedEmail, context)
      .then((userData) => {
        throw new Error("user created");
      })
      .catch((err) => {
        expect(err.message).toEqual(expect.stringContaining(errorsDictionary.EMAIL_ALREADY_IN_USE));
        done();
      });
  });
  it("Add user: Throws error if user's username already exists", (done) => {
    addUser(null, userRepeatedUsername, context)
      .then((userData) => {
        throw new Error("user created");
      })
      .catch((err) => {
        expect(err.message).toEqual(expect.stringContaining(errorsDictionary.USERNAME_ALREADY_IN_USE));
        done();
      });
  });
  it("Add user: Returns user after adding it", (done) => {
    addUser(null, userUnique, context)
      .then((userData) => {
        expect(userData).toHaveProperty("username");
        done();
      });
  });
  it("Delete user: Deletes user", (done) => {
    deleteUser(null, {id:'123'}, context)
      .then((userData) => {
        expect(userData).toHaveProperty("id");
        done();
      });
  });
  it("Logout: Call clear cookie", (done) => {
    logoutUser(null, {id:'123'}, context)
      .then((userData) => {
        expect(auth.clearCookie.mock.calls.length).toBe(1);
        done();
      });
  });
});