import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const Document = () => (
  <Html>
    <Head>
      <Script src="https://code.responsivevoice.org/responsivevoice.js?key=1KszbUyW"></Script>
    </Head>
    <body data-theme="black">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
