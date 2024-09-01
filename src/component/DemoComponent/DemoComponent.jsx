import React from 'react';
import { useAuth } from './AuthProvider';
import { useToggle } from './AuthProvider'; // Note: We're now importing useToggle from AuthProvider

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