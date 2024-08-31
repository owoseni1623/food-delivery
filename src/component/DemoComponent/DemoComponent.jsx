// The reason i create a new component that demonstrates how to use both the AuthContext and ToggleContext:


import React from 'react';
import { useAuth } from './AuthProvider';
import { useToggle } from './ToggleContext';

const DemoComponent = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const { toggleStates, setToggle, toggle } = useToggle();

  return (
    <div>
      <h1>Demo Component</h1>
      <div>
        {isLoggedIn ? (
          <>
            <p>Welcome, {user?.name}!</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => login('demo@example.com', 'password123')}>Login</button>
        )}
      </div>
      <div>
        <h2>Toggle Demo</h2>
        <button onClick={() => toggle('demoToggle')}>
          Toggle is {toggleStates.demoToggle ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

export default DemoComponent;