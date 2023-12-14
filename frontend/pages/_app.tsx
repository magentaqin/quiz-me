import Layout from "../components/Layout";
import Head from "next/head";
import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import type { AppProps } from "next/app";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>QuizMe</title>
        <meta name="description" content="Quiz yourself on frontend!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DQMJH33LP7"
        onLoad={() => {
          (window as any).dataLayer = (window as any).dataLayer || [];
          function gtag(s1: any, s2: any) {
            (window as any).dataLayer.push(arguments);
          }
          gtag("js", new Date());

          gtag("config", "G-DQMJH33LP7");
        }}
      />
    </>
  );
}

export default MyApp;
