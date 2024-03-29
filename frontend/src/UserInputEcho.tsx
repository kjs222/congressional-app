import React, { useState, ChangeEvent } from 'react';

const UserInputEcho: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <h2>Type Something please:</h2>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      <p>Echo: {userInput}</p>
    </div>
  );
};

export default UserInputEcho;

