import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";
import Text from "../Text";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Header = ({ setOpenChangePasswordPopup }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const fullName = session?.user?.details?.fullName;
  const isAdmin = session?.user?.details?.isAdmin;

  const signOutAndRedirect = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/",
    });
    router.push("/");
    return null;
  };

  return (
    <div className="flex pl-7 pt-2 pb-2 relative border-b-2 mb-2">
      <img
        src="https://linkup.eternussolutions.com/_layouts/15/images/LinkupImages/eternus.png"
        height="40"
        width="120"
        alt="Infobeans Logo"
      />
      <Text variant="h5" className="mt-auto mb-auto ml-10">
        {fullName}
      </Text>
      {isAdmin === "true" && window.location.pathname === "/home" ? (
        <Text
          variant="caption"
          className="!text-primaryBg cursor-pointer absolute right-[310px] top-[16px]"
          onClick={() => router.push("adminDashboard")}
        >
          Admin Dashboard
        </Text>
      ) : null}
      {isAdmin === "true" && window.location.pathname === "/adminDashboard" ? (
        <Text
          variant="caption"
          className="!text-primaryBg cursor-pointer absolute right-[160px] top-[16px]"
          onClick={() => router.push("home")}
        >
          Home
        </Text>
      ) : null}
      {window.location.pathname === "/home" ? (
        <Text
          variant="caption"
          className="!text-primaryBg cursor-pointer absolute right-[160px] top-[16px]"
          onClick={() => setOpenChangePasswordPopup(true)}
        >
          Change Password
        </Text>
      ) : null}

      <Button
        type="button"
        text="Log Out"
        onClick={signOutAndRedirect}
        className="absolute right-10"
      />
    </div>
  );
};

export default Header;

Header.propTypes = {
  setOpenChangePasswordPopup: PropTypes.func,
};
