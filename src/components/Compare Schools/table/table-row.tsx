import React, { ReactNode } from "react";

type TableRowProps = {
  header: string;
  isTitle?: boolean;
  data?: ReactNode[] | string[];
};

const TableRow = ({ header, data = [], isTitle = false }: TableRowProps) => {
  if (isTitle) {
    return (
      <tr className="bg-green-500">
        <td
          className="px-6 py-4 font-bold text-white text-xl capitalize"
          colSpan={4}
        >
          {header}
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-white border-b  hover:bg-gray-50 ">
      <td className="px-6 py-4 font-bold text-gray-900 capitalize ">
        {header}
      </td>
      {data?.map((cellData, idx) => (
        <td
          className="px-6 py-4 font-semibold text-gray-700  capitalize text-center"
          key={idx}
        >
          {cellData}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
