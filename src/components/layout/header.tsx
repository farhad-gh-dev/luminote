import React from "react";

const Header: React.FC = () => {
  return (
    <header className="mb-4">
      <h1 className="text-2xl font-bold text-indigo-600">LumiNote</h1>
      <p className="text-sm text-gray-500">Your saved highlights</p>
    </header>
  );
};

export default Header;
