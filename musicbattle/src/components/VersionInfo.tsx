import React from "react";

const version = import.meta.env.VITE_APP_VERSION;

const VersionInfo: React.FC = () => {
  return (
    <p className="text-sm text-gray-600 text-center w-full py-2">
      Version: {version}
    </p>
  );
};

export default VersionInfo;