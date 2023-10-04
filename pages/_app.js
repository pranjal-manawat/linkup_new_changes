import { SessionProvider } from "next-auth/react";
import { ThemeContextProvider } from "../context/themeContext";
import { Toaster } from 'react-hot-toast';
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeContextProvider>
        <Component {...pageProps} />
        <Toaster />
      </ThemeContextProvider>
    </SessionProvider>
  );
};

export default MyApp;
