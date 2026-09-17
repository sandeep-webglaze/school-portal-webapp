import React from "react";
import { Container } from "../Container";
import { ColoredHeading } from "../Heading";
import Link from "next/link";

const Features = () => {
  return (
    <Container>
      <>
        <div>
          <ColoredHeading
            center={true}
            title="Our"
            subtitle="Our key services and roles as an educational consulting company."
            greenText="Services"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 ">
          <Link href="/search/all-schools">
            <div className="border rounded-md shadow-md p-4 hover:scale-105   transition duration-500 cursor-pointer">
              <div className="bg-greenish-light rounded-full w-16 h-16 flex justify-center items-center text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0.585693L18 6.58569V9H22V19H23V21H1V19H2V9H6V6.58569L12 0.585693ZM18 19H20V11H18V19ZM6 11H4V19H6V11ZM8 7.41412V18.9999H11V12H13V18.9999H16V7.41412L12 3.41412L8 7.41412Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h4 className="uppercase mt-6 text-gray-500 font-medium mb-3">
                Explore Schools
              </h4>
              <p className="font-light text-sm text-gray-500 mb-3">
                Refer to our school listing and explore schools from all parts
                of India.
              </p>
              <div className="text-green-600 flex items-center hover:text-green-600">
                <p>Explore Schools →</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/contact-us">
            <div className="border rounded-md shadow-md p-4 hover:scale-105   transition duration-500 cursor-pointer ">
              <div className="bg-greenish-light rounded-full w-16 h-16 flex justify-center items-center text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM11 7V17H13V7H11ZM15 11V17H17V11H15ZM7 13V17H9V13H7Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h4 className="uppercase mt-6 text-gray-500 font-medium mb-3">
                Get Experts advice
              </h4>
              <p className="font-light text-sm text-gray-500 mb-3">
                Help yourself with our specialized assistance offered by us as a
                consultancy service.
              </p>
              <div className="text-green-600 flex items-center hover:text-green-600">
                <p>Get Experts Advice →</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/claim-school">
            <div className="border rounded-md shadow-md p-4 hover:scale-105   transition duration-500 cursor-pointer ">
              <div className="bg-greenish-light rounded-full w-16 h-16 flex justify-center items-center text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21.0082 3C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM20 5H4V19H20V5ZM18 15V17H6V15H18ZM12 7V13H6V7H12ZM18 11V13H14V11H18ZM10 9H8V11H10V9ZM18 7V9H14V7H18Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h4 className="uppercase mt-6 text-gray-500 font-medium mb-3">
                Claim School
              </h4>
              <p className="font-light text-sm text-gray-500 mb-3">
                Write reviews on schools here to guide other parents or students
                like you.
              </p>
              <div className="text-green-600 flex items-center hover:text-green-600">
                <p>Claim Your School →</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/compare-schools">
            <div className="border rounded-md shadow-md p-4 hover:scale-105   transition duration-500 cursor-pointer ">
              <div className="bg-greenish-light rounded-full w-16 h-16 flex justify-center items-center text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="uppercase mt-6 text-gray-500 font-medium mb-3">
                Compare Schools
              </h4>
              <p className="font-light text-sm text-gray-500 mb-3">
                Know about minute details & facilities of each school from our
                thoroughly curated listing.
              </p>
              <div className="text-green-600 flex items-center hover:text-green-600">
                <p>Compare Schools →</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/contact-us">
            <div className="border rounded-md shadow-md p-4 hover:scale-105   transition duration-500 cursor-pointer ">
              <div className="bg-greenish-light rounded-full w-16 h-16 flex justify-center items-center text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M2 22L7.29117 20.8242C8.6944 21.5746 10.2975 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.7025 2.42544 15.3056 3.17581 16.7088L2 22ZM8.23428 19.0605L7.58075 18.711L4.63416 19.3658L5.28896 16.4192L4.93949 15.7657C4.32549 14.6175 4 13.3345 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C10.6655 20 9.38248 19.6745 8.23428 19.0605ZM15.4487 7H13.4411L13.2661 9.00024H11.2584L11.4334 7H9.42577L9.25077 9.00024H7V11.0002H9.0758L8.90082 13.0002H7V15.0002H8.72584L8.55089 17H10.5585L10.7335 15.0002H12.7411L12.5662 17H14.5738L14.7488 15.0002H17V13.0002H14.9237L15.0987 11.0002H17V9.00024H15.2737L15.4487 7ZM11.0834 11.0002H13.0911L12.9161 13.0002H10.9085L11.0834 11.0002Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h4 className="uppercase mt-6 text-gray-500 font-medium mb-3">
                Free Counselling
              </h4>
              <p className="font-light text-sm text-gray-500 mb-3">
                Get access to free counselling service for your kids to clear
                their queries.
              </p>
              <div className="text-green-600 flex items-center hover:text-green-600">
                <p>Get Free Counselling →</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="https://blog.edhippo.com/" target="_blank">
            <div className="border rounded-md shadow-md p-4 hover:scale-105   transition duration-500 cursor-pointer ">
              <div className="bg-greenish-light rounded-full w-16 h-16 flex justify-center items-center text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12.5 7C14.433 7 16 8.567 16 10.5C16 11.7668 15.327 12.8763 14.3191 13.4907L16.869 17H14.397L12.217 14H10V17H8V7H12.5ZM12.5 9H10V12H12.5C13.2797 12 13.9204 11.4051 13.9931 10.6445L14 10.5C14 9.67157 13.3284 9 12.5 9Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h4 className="uppercase mt-6 text-gray-500 font-medium mb-3">
                Blogs
              </h4>
              <p className="font-light text-sm text-gray-500 mb-3">
                Read our latest articles, school guides and admission tips to
                help you make informed decisions for your child.
              </p>
              <div className="text-green-600 flex items-center hover:text-green-600">
                <p>Read Our Blogs →</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </>
    </Container>
  );
};

export { Features };
