import React, { useEffect, useState } from "react";
import { Button, Input, Text } from "../../components/common";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postData, getData } from "../../utils/rest";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const router = useRouter();

  const signUpValidationSchema = yup.object().shape({
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
    employeeId: yup
      .number()
      .typeError("Employee ID is required")
      .test(
        "positive",
        "Employee ID must be greater than 0",
        (value) => value > 0
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      employeeId: null,
    },
    resolver: yupResolver(signUpValidationSchema),
  });

  const postSignupData = async (payload) => {
    try {
      const url = "http://localhost:5000/signup";
      const { success, error, data } = await postData(
        url,
        { ...payload, isAdmin: "false" },
        {}
      );

      if (success) {
        console.log("Response ", data.message);
        router.push("/");
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
      className="mt-5 max-w-[30%] ml-[35%] p-5 border-2 border-paperSecondary"
    >
      <div className="flex justify-center">
        <Text variant="h4">SignUp</Text>
      </div>
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter value"
        className=""
        {...register("fullName")}
        itemRequired
        errorMessage={errors?.fullName?.message}
      />
      <Input
        label="Email"
        type="text"
        placeholder="Enter value"
        className=""
        {...register("email")}
        itemRequired
        errorMessage={errors?.email?.message}
      />
      <Input
        label="Employee Id"
        type="number"
        placeholder="Enter value"
        className=""
        {...register("employeeId")}
        itemRequired
        errorMessage={errors?.employeeId?.message}
      />
      <Input
        label="Password"
        type="text"
        placeholder="Enter value"
        className=""
        {...register("password")}
        itemRequired
        errorMessage={errors?.password?.message}
      />
      <Button
        text="Create Account"
        type="submit"
        className="ml-auto mr-auto mt-2 w-full"
      />
      <div className="inline-flex">
        <Text variant="hint" className="mt-3">
          Already have an Account?
        </Text>
        <Text
          variant="hint"
          className="mt-3 ml-1 !text-primaryText cursor-pointer"
          onClick={() => router.push("/")}
        >
          Log In
        </Text>
      </div>
    </form>
  );
};

export default SignUpPage;
