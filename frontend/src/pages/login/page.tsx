import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1>Login:</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameInputChange}
          placeholder="JSmith1900"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordInputChange}
        />
      </div>
    </form>
  );
}
