import { createContext, useContext, useReducer, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create AuthContext
const AuthContext = createContext();

//const initialState = {
  //isAuthenticated: false,
 // user: null,
 // token: null,
//};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const decodedToken = jwtDecode(action.payload.token); // Decode token to get user details
      localStorage.setItem('token', action.payload.token); // Save token to local storage
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: decodedToken, // Set user details from the decoded token
      };
    case 'LOGOUT':
      localStorage.removeItem('token'); // Remove token from local storage
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null, // Clear the user
      };
    default:
      return state;
  }
};

// AuthProvider component
const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem('token');
  const initialState = tokenFromStorage
    ? { isAuthenticated: true, token: tokenFromStorage, user: jwtDecode(tokenFromStorage) } // Decode user from token
    : { isAuthenticated: false, token: null, user: null };

  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if token is still valid and manage token expiration if needed
    if (authState.token) {
      try {
        const decodedToken = jwtDecode(authState.token);
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch({ type: 'LOGOUT' }); // Log out if token is expired
        }
      } catch (error) {
        console.error("Error decoding token: ", error);
        dispatch({ type: 'LOGOUT' }); // Log out on any decoding error
      }
    }
  }, [authState.token]);

  // Define the login function
  const login = async (token) => {
    try {
      dispatch({ type: 'LOGIN', payload: { token } });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
