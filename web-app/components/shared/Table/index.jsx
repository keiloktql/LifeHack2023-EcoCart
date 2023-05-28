import { Link } from "next";

const Table = ({ columns, rows }) => {
  // const loadMerchantImage = () => {};

  return (
    <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns &&
              columns.map((column, index) => (
                <th
                  scope="col"
                  className={`px-6 py-3 ${column.hidden ? "sr-only" : ""}`}
                >
                  {column.name}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {/* Stopped here */}
          <tr className="bg-white border-b hover:bg-gray-50">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              350
            </th>
            <td className="px-6 py-4">Shopee</td>
            <td className="px-6 py-4">May 20, 2023</td>
            <td className="px-6 py-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="#"
                className="font-medium text-blue-600 hover:underline"
              >
                View more
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              CO2 Emission
            </th>
            <th scope="col" className="px-6 py-3">
              Merchant
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              View more
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b hover:bg-gray-50">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              350
            </th>
            <td className="px-6 py-4">Shopee</td>
            <td className="px-6 py-4">May 20, 2023</td>
            <td className="px-6 py-4">
              <Link
                href="#"
                className="font-medium text-blue-600 hover:underline"
              >
                View more
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
