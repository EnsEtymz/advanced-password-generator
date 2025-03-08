import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-32 h-32 border-8 border-[#34c75a] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;