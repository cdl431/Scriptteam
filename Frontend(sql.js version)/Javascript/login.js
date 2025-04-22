import { loginUser } from "./auth.js";
// replace with fetch when backend is ready
const fakeUser = {
  name: "Thomas Nguyen",
  email: "thomas@ezwatch.com"
};

loginUser(fakeUser);
