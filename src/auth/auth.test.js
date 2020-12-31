const auth = require('./index');
//auth.verifyCookie = jest.fn();
const admin = require("firebase-admin");
const firebaseMocks = require("../../tests-setup/firebase-mocks");
const { SUCCESS_STATUS } = require("@mokuroku/mokuroku-commons/dictionaries/statuses");

describe('Auth', () => {
  jest.spyOn(admin, "auth").mockImplementation(() => firebaseMocks.auth);
  it('Returns user from cookie if cookie exists', (done)=>{
    const req = {
      cookies:{__session:'mock-session-cookie'},
      headers:{authorization:'mock-authorized'}
    };
    auth.getContext({req, res:{}}).then(userData=>{
      expect(userData).toHaveProperty("id");
      done();
    })
  })

  it('Creates cookie if it doesn´t exist and user is authorized', (done)=>{
    const req = {
      cookies: { },
      headers: { authorization: "Bearer: mock-authorized" },
    };
    const res = {
      cookie: jest.fn()
    }
    auth.getContext({req, res}).then(userData=>{
      expect(res.cookie).toHaveBeenCalled();
      done();
    })
  })
  it('Clears cookie', (done)=>{
    const req = {
      cookies: { },
      headers: { authorization: "Bearer: mock-authorized" },
    };
    const res = {
      cookie: jest.fn(),
      clearCookie: jest.fn()
    }
    auth.getContext({ req, res }).then((userData) => {
      const result = auth.clearCookie();
      expect(result.status).toEqual(SUCCESS_STATUS);
      done();
    });
    
  })
});