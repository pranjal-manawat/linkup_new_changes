import React from "react";
import Button from "../Button";
import Text from '../Text'
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const fullName = session?.user?.details?.fullName;

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
      <img src="https://linkup.eternussolutions.com/_layouts/15/images/LinkupImages/eternus.png" height="40" width="120" alt="Infobeans Logo" />
      <Text variant="h5" className="mt-auto mb-auto ml-10">{fullName}</Text>
      <Button type="button" text="Log Out" onClick={signOutAndRedirect} className="absolute right-10"/>
    </div>
  );
};

export default Header;

Header.propTypes = {};
