import { Facility, School, SchoolBoard } from "@/api/schools";
import TableRow from "./table/table-row";
import { Rating } from "../Rating";
import Link from "next/link";
import { SITE_NAME } from "@/constants";
import Image from "next/image";


type CopmareSchoolProps = {
  schools: Omit<School, "city">[];
  handleRemove?: (school: Omit<School, "city">, index: number) => void;
};

const SchoolBoards = ({
  boards,
  key,
}: {
  boards: SchoolBoard[];
  key: string;
}) => {
  return (
    <div key={key} className="flex-wrap flex gap-3 m-auto justify-center">
      {boards.map((board) => (
        <div
          className="text-white  bg-green-500 rounded-lg w-min shadow-lg p-2 uppercase"
          key={board._id}
        >
          {board.name}
        </div>
      ))}
    </div>
  );
};

const CompareTable = ({ schools, handleRemove }: CopmareSchoolProps) => {
  const uniqueFacilities = schools.reduce((accumulator: Facility[], school) => {
    school.facilities.forEach((facility) => {
      if (!accumulator.find((f) => f._id === facility._id)) {
        accumulator.push(facility);
      }
    });
    return accumulator;
  }, []);

  if (schools.length > 3) {
    return <></>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-6 border">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr className="">
            <th scope="col" className="px-16 py-3">
              <span className="sr-only">name</span>
            </th>
            {schools.map(({ _id, name, slug, images }) => (
              <th
                scope="col"
                className="px-6 py-3 text-xl items-center"
                key={_id}
              >
                <Link
                  href={"/school/" + slug?.slug}
                  className="cursor-pointer w-min"
                >
                  <Image
                    className="w-20 h-20 rounded-full m-auto "
                    src={
                      images[0] ??
                      "https://www.eduminatti.com/_next/image?url=%2FhomeImg.jpg&w=1200&q=100"
                    }
                    alt={`${name} | ${SITE_NAME}`}
                    width={80}
                    height={80}
                  />
                  {/* Was <h1> — the page already has a single <h1> in
                      CompareSchools.tsx ("Compare Schools"). Each compared
                      school is a column header, semantically a <th> child,
                      so <span> + visual styling is correct. Previously this
                      shipped 1–3 extra <h1> tags per page, which dropped
                      keyword focus and tripped SEO audits. */}
                  <span className="text-center block font-semibold">{name}</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Basic Detail Comparision */}
          <TableRow isTitle={true} header="Basic School Stats" />
          <TableRow
            header="Type of School"
            data={schools.map((school) =>
              school.type?.map((type) => type.name).toString()
            )}
          />
          <TableRow
            header="School Category"
            data={schools.map((school) => school.classification.name)}
          />
          <TableRow
            header="Classes From"
            data={schools.map((school) => school.classFrom)}
          />
          <TableRow
            header="Classes To"
            data={schools.map((school) => school.classTo)}
          />
          <TableRow
            header="Established Year"
            data={schools.map((school) => school.establishmentYear)}
          />
          <TableRow
            header="Boards"
            data={schools.map((school) => (
              <SchoolBoards boards={school.schoolBoards} key={school._id} />
            ))}
          />

          {/* Fees Comparision */}
          <TableRow isTitle={true} header="School Fees" />
          <TableRow
            header="Minimum Fees"
            data={schools.map((school) => "₹ " + school.minFees)}
          />
          <TableRow
            header="Maximum Fees"
            data={schools.map((school) => "₹ " + school.maxFees)}
          />

          {/* Rating Comparision */}
          <TableRow isTitle={true} header="School Rating" />
          <TableRow
            header="School Rating"
            data={schools.map((school) => (
              <div className="flex justify-center" key={school._id}>
                <Rating value={school.avgRating} />
              </div>
            ))}
          />
          <TableRow
            header="Academics"
            data={schools.map((school, idx) => (
              <div className="flex justify-center" key={school._id + idx}>
                <Rating value={school.avgAcademicsRating} />
              </div>
            ))}
          />
          <TableRow
            header="Infrastructure"
            data={schools.map((school, idx) => (
              <div className="flex justify-center" key={idx}>
                <Rating value={school.avgInfrastructureRating} />
              </div>
            ))}
          />
          <TableRow
            header="Administration"
            data={schools.map((school, idx) => (
              <div className="flex justify-center" key={idx + school._id}>
                <Rating value={school.avgAddmissionRating} />
              </div>
            ))}
          />
          <TableRow
            header="Extracurricular"
            data={schools.map((school) => (
              <div className="flex justify-center" key={school._id}>
                <Rating value={school.avgExtracurriclarRating} />
              </div>
            ))}
          />

          {/* Basic Detail Comparision */}
          <TableRow isTitle={true} header="School Details" />
          <TableRow
            header="Admission Starts"
            data={schools.map((school) => school.admissionStart)}
          />
          <TableRow
            header="Admission Ends"
            data={schools.map((school) => school.admissionEnd)}
          />
          <TableRow
            header="Chairman Name"
            data={schools.map((school) => school.chairman)}
          />

          {/* Facility Comparision */}
          {uniqueFacilities.length > 0 && (
            <TableRow isTitle={true} header="School Facilities" />
          )}
          {uniqueFacilities.map((facility) => (
            <TableRow
              key={facility._id}
              header={facility.name}
              data={schools.map((school) =>
                school.facilities.some(
                  (schoolFac) => schoolFac._id === facility._id
                ) ? (
                  <svg
                    className="w-3 h-3 text-green-500 m-auto"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                    key={facility._id}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 text-red-500 m-auto"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    key={school._id}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                )
              )}
            />
          ))}

          {/* Remove School from comparision */}
          <TableRow
            header=""
            data={schools.map((school, index) => (
              <button
                key={school._id}
                className="px-8 py-2 shadow-md cursor-pointer bg-red-600 text-white rounded-md"
                onClick={() => handleRemove && handleRemove(school, index)}
              >
                Remove
              </button>
            ))}
          />
        </tbody>
      </table>
    </div>
  );
};

export default CompareTable;
