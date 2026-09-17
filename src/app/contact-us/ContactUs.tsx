"use client";
import { getMediaDetails } from "@/_mocks_/NavJson";
import { ContactForm } from "@/components/ContactUs";
import { Container } from "@/components/Container";
import { ColoredHeading } from "@/components/Heading";
import useConfigStore from "@/hooks/useConfigStore";
import Link from "next/link";
import React, { Fragment } from "react";

import { FaEnvelope } from "react-icons/fa6";

// NOTE: <title> and <meta name="description"> previously lived in a
// next/head <Head> block right here. That API is Pages-Router-only — in
// the App Router it silently renders the tags into the body, which
// Search Console flags under "Robots/Directives outside head". The real
// metadata is now declared via generateMetadata() in app/contact-us/page.tsx.

const Contact = () => {
  const { config } = useConfigStore();
  const media = getMediaDetails(config);

  return (
    <Fragment>
      <div className='bg-[url("/images/contact-us.avif")] bg-no-repeat bg-cover bg-right md:bg-center '>
        <Container bgColor="px-4  flex  items-center sm:px-8 lg:px-10 pt-10 md:pt-20 max-w-screen lg:w-screen md:h-[450px]  h-[250px] lg:h-[45vh]  ">
          <div className=" p-2 lg:p-6 max-w-sm lg:max-w-lg xl:max-w-2xl  ">
            {/* H1 was "Contact Us" (10 chars) — too short for SEO. Expanded
                with the brand + value prop so the page's main heading
                ranks for "school admission counseling" queries too. */}
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-10 text-white">
              Contact <span className="text-greenish-light">EdHippo Academy</span>{" "}
              — Free School Admission Help
            </h1>
          </div>
        </Container>
      </div>
      <section className="py-16 bg-gray-100 ">
        <div className="justify-center flex-1 max-w-5xl px-4 py-4 mx-auto lg:py-10 md:px-7">
          <div className="max-w-xl mx-auto">
            <div className="text-center ">
              <div className="relative flex flex-col items-center">
                <h2 className=" text-3xl md:text-5xl font-bold ">
                  Our <span className="text-green-500"> Contact</span>
                </h2>
                <div className="flex w-24 mt-1 mb-10 overflow-hidden rounded">
                  <div className="flex-1 h-2 bg-green-200"></div>
                  <div className="flex-1 h-2 bg-green-400"></div>
                  <div className="flex-1 h-2 bg-green-600"></div>
                </div>
              </div>
              <p className="mb-16  text-sm md:text-base text-center text-gray-500">
                Feel free to reach out to our dedicated support team for any
                inquiries, assistance, or collaborations. Your educational
                journey is our priority, and were here to ensure you have all
                the information you need.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap mb-8 -mx-4">
            <div className="w-full px-4 mb-4 lg:w-1/3 lg:mb-0">
              <div className="h-full py-12 text-center transition-all rounded-lg shadow  bg-white hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-6 text-gray-100 bg-green-500 rounded-full ">
                  <FaEnvelope className="text-white" />
                </div>
                <p className="mb-4 text-xl font-bold leading-9 text-gray-700 md:text-2xl ">
                  Email
                </p>
                <a
                  href={`mailto:${config?.contactUs.mail}`}
                  target="_blank"
                  className="text-base font-medium text-gray-500 md:text-lg"
                >
                  {config?.contactUs.mail}
                </a>
              </div>
            </div>
            <div className="w-full px-4 mb-4 lg:w-1/3 lg:mb-0">
              <div className="h-full py-12 text-center transition-all rounded-lg shadow  bg-white hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-6 text-gray-100 bg-green-500 rounded-full ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-telephone"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"></path>
                  </svg>
                </div>
                <p className="mb-4 text-xl font-bold leading-9 text-gray-700 md:text-2xl ">
                  Phone
                </p>
                <a
                  href={`tel:${config?.contactUs.phoneNumber}`}
                  target="_blank"
                  className="text-base font-medium text-gray-500 md:text-lg "
                >
                  {config?.contactUs.phoneNumber}
                </a>
              </div>
            </div>
            <div className="w-full px-4 mb-4 lg:w-1/3 lg:mb-0">
              <div className="h-full py-12 text-center transition-all rounded-lg shadow  bg-white hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-6 text-gray-100 bg-green-500 rounded-full ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-grid-3x3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zM1.5 1a.5.5 0 0 0-.5.5V5h4V1H1.5zM5 6H1v4h4V6zm1 4h4V6H6v4zm-1 1H1v3.5a.5.5 0 0 0 .5.5H5v-4zm1 0v4h4v-4H6zm5 0v4h3.5a.5.5 0 0 0 .5-.5V11h-4zm0-1h4V6h-4v4zm0-5h4V1.5a.5.5 0 0 0-.5-.5H11v4zm-1 0V1H6v4h4z"></path>
                  </svg>
                </div>
                <p className="mb-4 text-xl font-bold leading-9 text-gray-700 md:text-2xl ">
                  Social
                </p>
                <div className="flex items-center justify-center  gap-3 text-xl text-green-600 ">
                  {media.map((item, id) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={id}
                        href={item.path}
                        target="_blank"
                        className="hover:text-green-600"
                      >
                        <Icon />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <ContactForm name="contact-form" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <ColoredHeading greenText={"Location"} title={"Our"} />
          <div className="flex w-24 mt-1  overflow-hidden rounded">
            <div className="flex-1 h-2 bg-green-600"></div>
          </div>

          <Container>
            {/* <div className="grid grid-cols-1   items-center justify-center">
                <Image
                  src="/images/pearls-omaxe.jpg"
                  width="150"
                  height="150"
                  className="rounded-full border object-cover w-[150px] h-[150px]"
                  alt={"Delhi Office | " + SITE_NAME}
                />
              

                <ul className="text-base">
                  <li className="my-1 flex  gap-3">
                    <span className="text-xl mt-1 text-greenish-light ">
                      <FaLocationDot className="text-inherit " />
                    </span>
                    {config?.contactUs.address}
                    
                  </li>
                  <a
                    href=  {`tel:${config?.contactUs.phoneNumber}`}
                    target="_blank"
                    className="my-1 flex items-center gap-3"
                  >
                    <FaPhone className="text-greenish-light" />
                    {config?.contactUs.phoneNumber}
                  </a>

                  <a
                    href={`mailto:${config?.contactUs.mail}`}
                    target="_blank"
                    className="my-1 flex items-center gap-3"
                  >
                    <FaEnvelope className="text-greenish-light" />
                    {config?.contactUs.mail}
                  </a>
                </ul>
              </div>
             
             
            
            </div> */}
            <div className="w-full">
              <p className="text-center pb-10 text-xl text-gray-600 lg:px-36">
                Explore our company&apos;s main office location below and find
                directions via Google Maps.
              </p>
              <div className=" text-center items-center justify-center w-full ">
                <div
                  style={{
                    textDecoration: "none",
                    overflow: "hidden",
                    maxWidth: "100%",
                    height: 500,
                  }}
                >
                  <div
                    id="canvas-for-googlemap"
                    style={{ height: "100%", width: "100%", maxWidth: "100%" }}
                  >
                    <iframe
                      style={{ height: "100%", width: "100%", border: 0 }}
                      frameBorder={0}
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.7674824543305!2d77.09234231125026!3d28.60675148514911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86aeb44bb164185f%3A0x97939eb5ee6bb93d!2sEDHIPPO%20ACADEMY%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1738318587059!5m2!1sen!2sin"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </Fragment>
  );
};

export default Contact;