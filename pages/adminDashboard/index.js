import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Header, Text } from "../../components/common";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getData, postData } from "../../utils/rest";
import EmployeeTable from "./EmployeeTable";
import CreateUserForm from "./CreateUserForm";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [employeesData, setEmployeesData] = useState([]);
  const [openPointsModal, setOpenPointsModal] = useState(false);
  const [openNewUserModal, setOpenNewUserPointsModal] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployeesData = async () => {
    try {
      setLoading(true);
      const url = "http://localhost:5000/allEmployeeRecords";
      const { data } = await getData(url);
      const employeeRecords = data?.data || [];
      setEmployeesData(employeeRecords);
      setLoading(false);
    } catch (e) {
      console.error("Error in fetching Employee records ", e);
    }
  };

  const handleUpdatePointsClick = (data) => {
    setOpenPointsModal(true);
    setActiveUserId(data.employeeId);
  };

  const PointsForm = () => {
    const pointsValidationSchema = yup.object().shape({
      points: yup
        .number()
        .required("Points are required")
        .typeError("Please enter a valid number")
        .test(
          "positive",
          "Please enter a value greater than 0",
          (value) => value > 0
        ),
      description: yup.string().required("Description is required"),
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      mode: "all",
      defaultValues: {
        points: null,
        description: "",
      },
      resolver: yupResolver(pointsValidationSchema),
    });

    const addPoints = async (payload) => {
      setOpenPointsModal(false);
      try {
        const url = "http://localhost:5000/addPoints";
        const { success, error, data } = await postData(url, payload, {});

        if (success) {
          console.log("Response ", data.message);
          toast.success("Points Added Successfully");
        } else {
          toast.error("Error ", error);
        }
      } catch (error) {
        toast.error("Error while adding points ", error);
      }
      fetchEmployeesData();
    };

    const removePoints = async (payload) => {
      setOpenPointsModal(false);
      try {
        const url = "http://localhost:5000/removePoints";
        const { success, error, data } = await postData(url, payload, {});

        if (success) {
          console.log("Response ", data.message);
          toast.success("Points Removed Successfully");
        } else {
          toast.error("Error ", error);
        }
      } catch (error) {
        toast.error("Error while removing points ", error);
      }
      fetchEmployeesData();
    };

    const onSubmit = async (data, e) => {
      e.preventDefault();
      if (e.nativeEvent.submitter.innerHTML === "Add Points")
        await addPoints({
          ...data,
          employeeId: activeUserId,
          createdByUser: session?.user?.details?.email,
        });
      else if (e.nativeEvent.submitter.innerHTML === "Remove Points")
        await removePoints({
          ...data,
          employeeId: activeUserId,
          createdByUser: session?.user?.details?.email,
        });
    };

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-inherit">
          <Input
            label="Points"
            type="number"
            placeholder="Enter value"
            className=""
            {...register("points")}
            itemRequired
            errorMessage={errors?.points?.message}
          />
          <Input
            label="Description"
            type="text"
            placeholder="Enter value"
            className=""
            {...register("description")}
            itemRequired
            errorMessage={errors?.description?.message}
          />
          <div className="inline-flex mt-4">
            <Button
              text="Add Points"
              className="pl-12 pr-12"
              type="submit"
              name="add"
            />
            <Button
              text="Remove Points"
              className="ml-3 pl-10 pr-10"
              type="submit"
              name="remove"
            />
          </div>
        </form>
      </>
    );
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

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
      <Header />
      {!loading ? (
        <EmployeeTable
          employeesData={employeesData}
          handleUpdatePointsClick={handleUpdatePointsClick}
          setOpenNewUserPointsModal={setOpenNewUserPointsModal}
        />
      ) : null}
      <Modal
        open={openPointsModal}
        handleClose={() => setOpenPointsModal(false)}
        children={<PointsForm activeUserId={activeUserId} />}
        title="Update Points"
        className="w-[30%]"
      />
      <Modal
        open={openNewUserModal}
        handleClose={() => setOpenNewUserPointsModal(false)}
        children={
          <CreateUserForm
            setOpenNewUserPointsModal={setOpenNewUserPointsModal}
            fetchEmployeesData={fetchEmployeesData}
          />
        }
        title="Add User Details"
        className="w-[30%]"
      />
    </>
  );
};

export default AdminDashboard;
