import React from "react";
import Image from "next/image";

const NoDataFound = () => {
  return (
    <div className="w-full">
      <Image
        src={"/images/noData.avif"}
        width={500}
        height={500}
        className="m-auto"
        alt={"No Data"}
      />
      {/* <p className="text-neutral-500 text-xl font-semibold m-4 text-center">
        No Data!
      </p> */}
    </div>
  );
};

export default NoDataFound;
