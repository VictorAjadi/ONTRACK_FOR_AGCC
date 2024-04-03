// AuthContext.js
import { createContext } from 'react';

const AuthContext = createContext({
  loaderData: null,
  setLoaderData: () => {},
});

export default AuthContext;
