import React from "react";
import { Button, Input, Text } from "../../../components/common";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postData } from "../../../utils/rest";
import { toast } from "react-hot-toast";

const changePasswordValidationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
      message:
        "Password should be at least 8 characters. Should contain 1 uppercase, 1 lowercase, 1 special char",
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
});

const ChangePassword = () => {
  const router = useRouter();
  const email = router.query.email || null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    resolver: yupResolver(changePasswordValidationSchema),
  });

  const onSubmit = async (submittedData) => {
    try {
      const payload = {
        email: email,
        password: submittedData.password
      }
      const url = "http://localhost:5000/resetPassword";
      const { success, error, data } = await postData(
        url,
        payload,
        {}
      );

      if (success) {
        console.log("Response ", data.message);
        router.push("/")
      } else {
        toast.error("Error ",error);
      }
    } catch (error) {
      toast.error("Error in reseting password ",error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="mt-5 max-w-[30%] ml-[35%] p-5 border-2 border-paperSecondary"
    >
      <div className="flex justify-center mb-4">
        <Text variant="h5">Enter New Password</Text>
      </div>
      <Input
        label="Password"
        type="text"
        placeholder="Enter value"
        className=""
        {...register("password")}
        itemRequired
        errorMessage={errors?.password?.message}
      />
      <Input
        label="Confirm Password"
        type="text"
        placeholder="Enter value"
        className=""
        {...register("confirmPassword")}
        itemRequired
        errorMessage={errors?.confirmPassword?.message}
      />
      <Button
        text="Change Password"
        type="submit"
        className="ml-auto mr-auto mt-2 w-full"
      />
    </form>
  );
};

export default ChangePassword;
