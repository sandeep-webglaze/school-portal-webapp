"use client";
import { SchoolList } from "@/api/schools";
import { ColoredHeading } from "@/components/Heading";
import Schools, { SchoolCard } from "@/components/Listings/Schools";
import NoDataFound from "@/components/NoDataFound";
import { VIEW_TYPE } from "@/constants";
import React, { FC, Fragment, useState } from "react";
type ShortListSchoolsProps = {
  schools: SchoolList[];
};
const ShortListSchools: FC<ShortListSchoolsProps> = ({ schools }) => {
  const [shortlistSchools, setShortListSchools] = useState(schools);
  const removeSchool = (schoolId: string) => {
    setShortListSchools((schools) =>
      schools.filter((school) => school._id !== schoolId)
    );
  };
  if (shortlistSchools.length < 1) return <NoDataFound />;
  return (
    <Fragment>
      <ColoredHeading mt={false} greenText={"Schools"} title={"ShortListed"} />
      <div className={`grid grid-cols-1 xl:grid-cols-2  gap-6 mt-6 `}>
        {shortlistSchools.map((school) => (
          <SchoolCard
            school={school}
            key={school._id}
            view={VIEW_TYPE.LISTVIEW}
            afterToggle={removeSchool}
            sendMailBtn
          />
        ))}
      </div>
    </Fragment>
  );
};

export default ShortListSchools;
