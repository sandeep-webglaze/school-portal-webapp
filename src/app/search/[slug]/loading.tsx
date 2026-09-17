import Spinner from "@/components/Spinner";
import React from "react";

const loading = () => {
  return (
    <div
      className="
      h-[70vh]
      flex 
      flex-col 
      justify-center 
      items-center 
    "
    >
      <Spinner />
    </div>
  );
};

export default loading;
