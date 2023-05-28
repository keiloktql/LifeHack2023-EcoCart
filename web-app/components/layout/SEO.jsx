import Head from "next/head";
import React from "react";

const SEO = ({ title = "EcoCart" }) => (
  <Head>
    <meta charSet="utf-8" />
    <title>{title}</title>
    <meta name="description" content="Sustainable Shopper Companion" />
  </Head>
);

export default SEO;
