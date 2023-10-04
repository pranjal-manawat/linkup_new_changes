import React, { useState, useEffect } from "react";
import { Input, Text, Button } from "../../components/common";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getData } from "../../utils/rest";

const ResetPassword = () => {
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const router = useRouter();
  const resetPasswordEmailSchema = yup.object().shape({
    email: yup
      .string()
      .test(
        "valid-email",
        "Please enter your valid Email Address which exists in the system",
        (value) => employeeEmails.includes(value)
      )
      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(resetPasswordEmailSchema),
  });

  const onSubmit = (data) => {
    router.push({ pathname: "/resetPassword/changePassword", query: data });
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
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="mt-5 max-w-[30%] ml-[35%] p-5 border-2 border-paperSecondary"
    >
      <div className="flex mb-8">
        <Text variant="h5">Please Enter Your Email Address</Text>
      </div>
      <Input
        label="Email"
        type="text"
        placeholder="Enter value"
        className=""
        {...register("email")}
        itemRequired
        errorMessage={errors?.email?.message}
      />
      <Button
        text="Continue"
        type="submit"
        className="ml-auto mr-auto mt-2 w-full"
      />
    </form>
  );
};

export default ResetPassword;
