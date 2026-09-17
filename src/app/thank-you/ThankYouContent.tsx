"use client";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { Fragment } from "react";
import { Container } from "../../components/Container";
import { Button } from "../../components/Button";

/**
 * Client-side body for /thank-you. Extracted from the route's page.tsx so
 * page.tsx can stay a server component and export `metadata` (App Router
 * forbids both "use client" and metadata in the same file).
 */
const ThankYouContent = () => {
  const router = useRouter();
  return (
    <Fragment>
      <Script id="google-tag-event" strategy="afterInteractive">
        {`gtag('event', 'conversion', {'send_to': 'AW-16505204313/oCcDCInYtJ4ZENncpb49'});`}
      </Script>
      <Container>
        <div className="flex  items-center justify-center p-5 w-full bg-white">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-green-200 p-4">
              <div className="rounded-full stroke-green-600 bg-green-300 p-4">
                <svg
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="60px"
                  height="60px"
                >
                  <path d="M 19.980469 5.9902344 A 1.0001 1.0001 0 0 0 19.292969 6.2929688 L 9 16.585938 L 5.7070312 13.292969 A 1.0001 1.0001 0 1 0 4.2929688 14.707031 L 8.2929688 18.707031 A 1.0001 1.0001 0 0 0 9.7070312 18.707031 L 20.707031 7.7070312 A 1.0001 1.0001 0 0 0 19.980469 5.9902344 z" />
                </svg>
              </div>
            </div>
            <h1 className="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]">
              Thank You!
            </h1>
            <p className="text-slate-600 mt-5 lg:text-lg">
              We have recieved your Enquiry.
              <br /> We will contact with you as soon as possible.
            </p>
            <Button label="Back to Homepage" onClick={() => router.push("/")} />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default ThankYouContent;
