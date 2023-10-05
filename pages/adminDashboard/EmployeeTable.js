import React, { useState } from "react";
import { Button, Input } from "../../components/common";
import PropTypes from "prop-types";

const EmployeeTable = ({
  employeesData,
  handleUpdatePointsClick,
  setOpenNewUserPointsModal,
}) => {
  const [employees, setEmployees] = useState(employeesData);

  const handleSearch = (value) => {
    if (value === "") {
      if (employees === employeesData) return;
      else {
        setEmployees(employeesData);
        return;
      }
    }
    const updatedEmployees = employeesData.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(value.toLowerCase()) ||
        emp.email.toLowerCase().includes(value.toLowerCase())
    );
    setEmployees(updatedEmployees);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="pb-1 bg-white ml-5 flex">
        <div className="relative mb-1 w-[20%]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pt-2">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 mb-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <Input
            type="text"
            className="h-10 pl-10 text-primaryText border-2 border-b-2 border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-primaryBg focus:border-primaryBg"
            placeholder="Search email"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {employeesData && employeesData.length ? (
          <div className="mt-auto mb-auto ml-5 font-medium text-gray-900">
            Total Users: {employeesData.length}
          </div>
        ) : null}
        <Button
          text="Create New User"
          type="button"
          onClick={() => {
            setOpenNewUserPointsModal(true);
          }}
          className="absolute top-3 right-10"
        />
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
          <th scope="col" className="px-6 py-3">
              Employee ID
            </th>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Total Points
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.length
            ? employees.map((employee, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {employee.employeeId}
                    </th>
                    <td className="px-6 py-4">{employee.fullName}</td>
                    <td className="px-6 py-4">{employee.email}</td>
                    <td className="px-6 py-4">{employee.rewardPoints}</td>
                    <td className="flex items-center px-6 py-4 space-x-3">
                      <Button
                        text="Update Points"
                        type="button"
                        onClick={() => {
                          handleUpdatePointsClick(employee);
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;

EmployeeTable.propTypes = {
  employeesData: PropTypes.array.isRequired,
  handleUpdatePointsClick: PropTypes.func,
};
