//Mock firebase admin and firestore response
const mockUser1 = {
  id: 1,
  data: jest.fn(() => {
    return { username: "superiris-test-be", fullname: "Iris V", country: "Mexico" };
  }),
};
const mockUser2 = {
  id: 2,
  data: jest.fn(() => {
    return { username: "piroshi-test-be", fullname: "Rob N", country: "Mexico" };
  }),
};
const mockUsersQueryResponse = [mockUser1, mockUser2];

const auth = {
  verifyIdToken: jest.fn((queryString) => ({
    user_id: 1,
  })),
  verifySessionCookie: jest.fn((queryString) => ({
    catch: jest.fn(() => mockUser1),
    then: jest.fn(() => mockUser1),
  })),
  createSessionCookie: jest.fn((queryString) => Promise.resolve(mockUser1)),
};

const firestore = {
  collection: jest.fn((path) => ({
    where: jest.fn((query, operator, data) => ({
      get: jest.fn((user) => (data == "iris-test@iris.com" || data == "superiris-test" ? mockUser1 : { empty: true })),
    })),
    get: jest.fn((queryString) => ({
      docs: mockUsersQueryResponse,
    })),
    doc: jest.fn((queryString) => ({
      set: jest.fn(() => mockUser1),
    })),
  })),
  doc: jest.fn((queryString) => ({
    get: jest.fn(() => mockUser1),
    delete: jest.fn(() => mockUser1),
  })),
};

module.exports.mockUser1 = mockUser1;
module.exports.mockUser2 = mockUser2;
module.exports.mockUsersQueryResponse = mockUsersQueryResponse;
module.exports.firestore = firestore;
module.exports.auth = auth;