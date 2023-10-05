import React, { useEffect, useState } from "react";
import { Text, Button, Header, Modal, Input } from "../../components/common";
import PointsHistoryTable from "./PointsHistoryTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { getData, postData } from "../../utils/rest";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const employeeId = session?.user?.details?.employeeId || null;
  const email = session?.user?.details?.email;
  const [points, setPoints] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [openChangePasswordPopup, setOpenChangePasswordPopup] = useState(false);

  const fetchPoints = async (employeeId) => {
    try {
      const url = `http://localhost:5000/points?employeeId=${employeeId}`;
      const { data } = await getData(url);
      const points = data?.data;
      setPoints(points);
    } catch (e) {
      console.error("Error in fetching Points ", e);
    }
  };

  const fetchPointsHistory = async (employeeId) => {
    try {
      const url = `http://localhost:5000/pointsHistory?employeeId=${employeeId}`;
      const { data } = await getData(url);
      const pointsHistory = data?.data || [];
      setPointsHistory(pointsHistory);
    } catch (e) {
      console.error("Error in fetching Points ", e);
    }
  };

  useEffect(() => {
    fetchPoints(employeeId);
    fetchPointsHistory(employeeId);
  }, [employeeId]);

  const ChangePasswordForm = ({ email }) => {
    const changePasswordValidationSchema = yup.object().shape({
      oldPassword: yup.string().required("Old Password is required"),
      newPassword: yup
        .string()
        .required("New Password is required")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
          message:
            "Password should be at least 8 characters. Should contain 1 uppercase, 1 lowercase, 1 special char",
        }),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      mode: "all",
      defaultValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      resolver: yupResolver(changePasswordValidationSchema),
    });

    const onSubmit = async (submittedData) => {
      try {
        const payload = {
          email,
          oldPassword: submittedData.oldPassword,
          newPassword: submittedData.newPassword,
        };
        const url = "http://localhost:5000/resetPassword";
        const { success, error, data } = await postData(url, payload, {});
        setOpenChangePasswordPopup(false);
        if (success) {
          console.log("Response ", data.message);
          toast.success("Password Changed Successfully");
        } else {
          toast.error("Error ", error);
        }
      } catch (error) {
        toast.error("Error in reseting password ", error);
      }
    };

    return (
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="max-w-[100%] p-2 pt-0"
      >
        <Input
          label="Old Password"
          type="password"
          placeholder="Enter Old Password"
          className=""
          {...register("oldPassword")}
          itemRequired
          errorMessage={errors?.oldPassword?.message}
        />
        <Input
          label="New Password"
          type="password"
          placeholder="Enter New Password"
          className=""
          {...register("newPassword")}
          itemRequired
          errorMessage={errors?.newPassword?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
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

  if (!session) {
    return (
      <div className="flex justify-center mt-[20%]">
        <Text variant="h4">
          No active session. Please
          <span
            className="text-primaryBg underline underline-offset-4 cursor-pointer ml-1"
            onClick={() => router.push("/")}
          >
            Log In
          </span>
        </Text>
      </div>
    );
  }

  return (
    <>
      <Header setOpenChangePasswordPopup={setOpenChangePasswordPopup} />
      <div className="flex justify-center p-2">
        <div className="mt-4">
          <div>
            <Text variant="h4">Balance: {points}</Text>
          </div>
          <div className="mt-4">
            <Button
              text="Redeem Now"
              type="button"
              className="mb-4 ml-auto mr-auto"
              onClick={()=>{
                window.open('https://docs.google.com/forms/d/e/1FAIpQLSflHUKg_u2Fw_JJaD3FxAHJMXBozfbkU2EH_Qcqp3N6F7pv7A/viewform');
              }}
            />
          </div>
        </div>
      </div>
      <PointsHistoryTable pointsHistoryData={pointsHistory} />
      <Modal
        open={openChangePasswordPopup}
        handleClose={() => setOpenChangePasswordPopup(false)}
        children={<ChangePasswordForm email={email} />}
        title="Change Password"
        className="w-[30%]"
      />
    </>
  );
};

export default HomePage;
