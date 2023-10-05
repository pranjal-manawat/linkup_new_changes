import React, { useEffect, useState } from "react";
import { Button, Input, Text } from "../../components/common";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postData, getData } from "../../utils/rest";
import { toast } from "react-hot-toast";

const CreateUserForm = ({setOpenNewUserPointsModal, fetchEmployeesData}) => {
  const [employeeEmails, setEmployeeEmails] = useState([]);

  const signUpValidationSchema = yup.object().shape({
    employeeId: yup
      .number()
      .typeError("Employee ID is required")
      .test("positive","Employee ID must be greater than 0", (value) => value > 0),
    fullName: yup.string().required("Full Name is required"),
    email: yup
      .string()
      .email("Please enter a valid email id")
      .test(
        "unique-email",
        "Account already exists for this email",
        (value) => !employeeEmails.includes(value)
      )
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message:
          "Password should be at least 8 characters. Should contain 1 uppercase, 1 lowercase, 1 special char",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      employeeId: null,
      fullName: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(signUpValidationSchema),
  });

  const postSignupData = async (payload) => {
    setOpenNewUserPointsModal(false);
    try {
      const url = "http://localhost:5000/signup";
      const { success, error, data } = await postData(
        url,
        { ...payload, isAdmin: "false" },
        {}
      );

      if (success) {
        toast.success("User Created Successfully");
        console.log("Response ", data.message);
        fetchEmployeesData();
      } else {
        toast.error("Error ", error);
      }
    } catch (error) {
      toast.error("Error in posting signUp data", error);
    }
  };

  const fetchEmployeeEmails = async () => {
    try {
      const url = "http://localhost:5000/allEmployeeRecords";
      const { data } = await getData(url);
      const employeeRecords = data?.data || [];
      const employeeEmails = employeeRecords.map((emp) => emp.email);
      setEmployeeEmails(employeeEmails);
    } catch (e) {
      console.error("Error in fetching Employee emails ", e);
    }
  };

  useEffect(() => {
    fetchEmployeeEmails();
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => postSignupData(data))}
      className="p-4 pt-1"
    >
      <Input
        label="Employee Id"
        type="number"
        placeholder="Enter Employee ID"
        className=""
        {...register("employeeId")}
        itemRequired
        errorMessage={errors?.employeeId?.message}
      />
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter Full Name"
        className=""
        {...register("fullName")}
        itemRequired
        errorMessage={errors?.fullName?.message}
      />
      <Input
        label="Email"
        type="text"
        placeholder="Enter Email"
        className=""
        {...register("email")}
        itemRequired
        errorMessage={errors?.email?.message}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter Password"
        className=""
        {...register("password")}
        itemRequired
        errorMessage={errors?.password?.message}
      />
      <Button
        text="Create User"
        type="submit"
        className="ml-auto mr-auto mt-4 w-full"
      />
    </form>
  );
};

export default CreateUserForm;
