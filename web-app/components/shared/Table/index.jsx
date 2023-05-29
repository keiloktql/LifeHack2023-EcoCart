import Image from "next/image";

const Table = ({ columns, rows }) => {
  return (
    <div className="relative overflow-x-auto shadow rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns &&
              columns.map((column, index) => (
                <th
                  key={`col-${index}`}
                  scope="col"
                  className={`px-6 py-3 ${column.hidden ? "sr-only" : ""}`}
                >
                  {column.name}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows &&
            rows.map((row, index) => (
              <tr
                key={`row-${index}`}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-bold text-primary-700"
                >
                  {row[0].value}
                </th>
                <td className="px-6 py-4 font-semibold">{row[1].value}</td>
                <td className="px-6 py-4">{row[2].value}</td>
                <td className="px-6 py-4">
                  {row[3].isLink ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={row[3].value}
                      className="font-medium text-primary-600 hover:underline"
                    >
                      View more
                    </a>
                  ) : (
                    row[3].value
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
