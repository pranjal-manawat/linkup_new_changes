import React, { useEffect, useState } from "react";
import { Text, Button, Header } from "../../components/common";
import PointsHistoryTable from "./PointsHistoryTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getData } from "../../utils/rest";

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const employeeId = session?.user?.details?.employeeId || null;
  const [points, setPoints] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);

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
            />
          </div>
        </div>
      </div>
      <PointsHistoryTable pointsHistoryData={pointsHistory} />
    </>
  );
};

export default HomePage;
