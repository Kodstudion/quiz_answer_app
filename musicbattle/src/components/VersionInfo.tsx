import React from "react";

const VersionInfo: React.FC = () => {
  return (
    <div className="text-sm text-gray-600">
      <p>
        Utvecklad av{" "}
        <a
          href="https://kodstudion.se"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600"
        >
          Kodstudion
        </a>{" "}
        version: {import.meta.env.VITE_APP_VERSION}
      </p>
    </div>
  );
};

export default VersionInfo;
