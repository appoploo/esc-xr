import "mapbox-gl/dist/mapbox-gl.css";
import { GetServerSideProps } from "next";
import type { AppProps } from "next/app";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withSessionSsr } from "../lib/withSession";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://code.responsivevoice.org/responsivevoice.js?key=1KszbUyW"></Script>

      <Component {...pageProps} />

      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (!user)
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    else {
      return {
        props: {},
      };
    }
  }
);

export default MyApp;
