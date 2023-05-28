/* eslint-disable no-unused-vars */
import React from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Logo from "@/public/assets/svg/logo.svg";
import IconsFlag from "@/public/assets/svg/icon-flags.svg";
import Image from "next/image";
import { FOOTER_NAV_LINKS_META } from "@/config/constants";
import Link from "next/link";
import Button from "../shared/Button";
import FormField from "../shared/FormField";

const FooterNavLinks = ({ variation }) => {
  const { heading, links } = FOOTER_NAV_LINKS_META[variation];
  return (
    <div>
      <h1 className="mb-4 text-sm font-semibold text-gray-500">{heading}</h1>
      <span className="flex flex-col">
        {links.map(({ href, text }, key) => (
          <Link
            key={key}
            className="my-1 font-semibold text-gray-600 first-of-type:mt-0 last-of-type:mb-0 hover:underline"
            href={href}
          >
            {text}
          </Link>
        ))}
      </span>
    </div>
  );
};

const Footer = () => {
  const validationSchema = Yup.object().shape({
    newsletterEmail: Yup.string()
      .email("Invalid format.")
      .required("Required field.")
  });

  const onSubmitFn = ({ newsletterEmail }) => {
    console.log("submitted fn");
  };

  return (
    <footer>
      <div className="flex flex-col">
        {/* Newsletter section */}
        <section className="flex justify-center bg-gray-50 px-16 py-12">
          <div className="flex w-full max-w-screen-xl justify-between">
            <div className="mr-2 flex w-full flex-col">
              <h2 className="text-xl font-semibold text-gray-900">
                Join our newsletter
              </h2>
              <p className="text-gray-600">
                Stay updated with the latest happenings from EcoCart.
              </p>
            </div>
            <div className="ml-2 w-full">
              <Formik
                initialValues={{
                  newsletterEmail: ""
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmitFn}
              >
                {({ isValid, dirty }) => (
                  <Form className="flex">
                    <FormField
                      fieldName="newsletterEmail"
                      placeholder="Enter your email"
                      disabled={false}
                      className="mr-2"
                    />
                    <Button
                      type="submit"
                      disabled={!dirty || !isValid}
                      onClickFn={() => console.log("Clicked subscribe btn")}
                      customClassName="ml-2"
                    >
                      Subscribe
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </section>
        {/* Main footer section */}
        <section className="flex justify-center px-16">
          <div className="flex w-full max-w-screen-xl flex-col">
            {/* Top */}
            <div className="flex justify-between py-14">
              <div>
                <Link href="/">
                  <Image src={Logo} width={200} alt="Logo" />
                </Link>
                <p className="mt-2 text-gray-600">
                  Sustainable Shopper Companion
                </p>
                <span className="mt-4 flex items-center">
                  <Image
                    className="singapore-flag mr-1 object-none"
                    src={IconsFlag}
                    width={21}
                    height={15}
                    alt="Flag"
                  />
                  <p className="ml-1 text-sm font-medium text-gray-500">
                    Singapore
                  </p>
                </span>
              </div>
              <div className="ml-32 mr-16 flex flex-auto flex-row justify-between">
                <FooterNavLinks variation="PRODUCT" />
                <FooterNavLinks variation="COMPANY" />
                <FooterNavLinks variation="RESOURCES" />
                <FooterNavLinks variation="LEGAL" />
              </div>
            </div>
            <hr className="flex" />
            {/* Bottom */}
            <div className="flex justify-between pb-8 pt-4">
              <p className="text-gray-500">
                Copyright &copy; 2023 EcoCart. All rights reserved.
              </p>
              {/* Socials */}
              <div></div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
