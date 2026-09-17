"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FcGoogle } from "react-icons/fc";
import "swiper/css";
import { Container } from "../Container";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "dompurify";

/**
 * Review HTML strings come from a third-party reviews service. They are
 * normally plain text but we run them through DOMPurify with FORBID_TAGS
 * so a hostile or misformatted review can never inject head-level tags
 * (meta robots, link rel=canonical, etc.) into the body — Testimonials
 * is rendered on every search slug + the homepage, so any such leak
 * would poison the SEO of those pages.
 */
const REVIEW_PURIFY_OPTS = {
  FORBID_TAGS: ["meta", "title", "base", "link", "script", "style", "iframe"],
  FORBID_ATTR: ["http-equiv", "onerror", "onload"],
};

type IReview = {
  id: string;
  reviewer_photo_link: string;
  reviewer_name: string;
  review_text: string;
  reviewer_link: string;
};

const Testimonials = () => {
  const [my_swiper, set_my_swiper] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const handlePrevButtonClick = () => {
    my_swiper.slidePrev();
  };

  const handleNextButtonClick = () => {
    my_swiper.slideNext();
  };

  useEffect(() => {
    fetch("https://data.accentapi.com/feed/25418192.json?nocache=1720674028062")
      .then((res) => res.json())
      .then((res) => {
        setReviews(res.reviews);
      });
  }, []);

  return (
    <Fragment>
      <Container>
        <section className="home__reviewsSection">
          <div className="relative mx-auto max-w-maxScreen ">
            <div className="flex flex-row items-center justify-between  py-4 pb-0  md:py-14">
              <div className="py-6 font-rubik md:py-0">
                <p className="md:section_heading text-blacky-light text-3xl font-bold md:text-[42px] md:font-semibold text-headText">
                  Recent <span className="text-greenish-light">Reviews</span>
                </p>
              </div>
              <div className=" flex-row gap-4 flex ">
                <button
                  className="grid md:h-10 md:w-20 w-10 h-7  bg-[#ededed] place-content-center rounded-full bg-grey50 text-black text-xl hover:bg-green-500 hover:text-white"
                  aria-label="Previous"
                  onClick={handlePrevButtonClick}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                </button>
                <button
                  className="grid md:h-10 md:w-20 w-10 h-7  bg-[#ededed] place-content-center rounded-full bg-grey50 text-black text-xl hover:bg-green-500 hover:text-white"
                  aria-label="Next"
                  onClick={handleNextButtonClick}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <Swiper
              onInit={(ev: any) => {
                set_my_swiper(ev);
              }}
              pagination={true}
              spaceBetween={40}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 40 },
                920: { slidesPerView: 1.8, spaceBetween: 40 },
                1010: { slidesPerView: 2, spaceBetween: 40 },
                1210: { slidesPerView: 2.4, spaceBetween: 20 },
                1400: { slidesPerView: 2.8, spaceBetween: 20 },
              }}
            >
              {reviews.map((review) => {
                if (!review.review_text) return;
                return (
                  <SwiperSlide className="pb-8" key={review.id}>
                    <div className="w-full  border space-y-4 rounded-xl px-5 py-7 shadow-xl md:w-[456px]   bg-white">
                      <div className="flex flex-row  items-center justify-between ">
                        <div className="flex  items-center gap-2">
                          <div className="h-14 w-14 translate-y-1 rounded-full overflow-hidden border border-white100">
                            <Image
                              id="preview"
                              src={review.reviewer_photo_link.replace(
                                /w\d+-h\d+/,
                                "w100-h100",
                              )}
                              width={56}
                              height={56}
                              loading="lazy"
                              alt="profile-pic"
                              className="object-cover w-full h-full rounded-full"
                            />
                          </div>
                          <div className="flex flex-col justify-center md:items-start items-center gap-2 mb-2">
                            <Link
                              href={review.reviewer_link}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="text-sm font-bold false hover:underline"
                            >
                              <p> {review.reviewer_name}</p>
                            </Link>

                            <div className="flex gap-1 text-yellow-500">
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                version="1.2"
                                baseProfile="tiny"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M3.1 11.3l3.6 3.3-1 4.6c-.1.6.1 1.2.6 1.5.2.2.5.3.8.3.2 0 .4 0 .6-.1 0 0 .1 0 .1-.1l4.1-2.3 4.1 2.3s.1 0 .1.1c.5.2 1.1.2 1.5-.1.5-.3.7-.9.6-1.5l-1-4.6c.4-.3 1-.9 1.6-1.5l1.9-1.7.1-.1c.4-.4.5-1 .3-1.5s-.6-.9-1.2-1h-.1l-4.7-.5-1.9-4.3s0-.1-.1-.1c-.1-.7-.6-1-1.1-1-.5 0-1 .3-1.3.8 0 0 0 .1-.1.1l-1.9 4.3-4.7.5h-.1c-.5.1-1 .5-1.2 1-.1.6 0 1.2.4 1.6z" />
                              </svg>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                version="1.2"
                                baseProfile="tiny"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M3.1 11.3l3.6 3.3-1 4.6c-.1.6.1 1.2.6 1.5.2.2.5.3.8.3.2 0 .4 0 .6-.1 0 0 .1 0 .1-.1l4.1-2.3 4.1 2.3s.1 0 .1.1c.5.2 1.1.2 1.5-.1.5-.3.7-.9.6-1.5l-1-4.6c.4-.3 1-.9 1.6-1.5l1.9-1.7.1-.1c.4-.4.5-1 .3-1.5s-.6-.9-1.2-1h-.1l-4.7-.5-1.9-4.3s0-.1-.1-.1c-.1-.7-.6-1-1.1-1-.5 0-1 .3-1.3.8 0 0 0 .1-.1.1l-1.9 4.3-4.7.5h-.1c-.5.1-1 .5-1.2 1-.1.6 0 1.2.4 1.6z" />
                              </svg>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                version="1.2"
                                baseProfile="tiny"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M3.1 11.3l3.6 3.3-1 4.6c-.1.6.1 1.2.6 1.5.2.2.5.3.8.3.2 0 .4 0 .6-.1 0 0 .1 0 .1-.1l4.1-2.3 4.1 2.3s.1 0 .1.1c.5.2 1.1.2 1.5-.1.5-.3.7-.9.6-1.5l-1-4.6c.4-.3 1-.9 1.6-1.5l1.9-1.7.1-.1c.4-.4.5-1 .3-1.5s-.6-.9-1.2-1h-.1l-4.7-.5-1.9-4.3s0-.1-.1-.1c-.1-.7-.6-1-1.1-1-.5 0-1 .3-1.3.8 0 0 0 .1-.1.1l-1.9 4.3-4.7.5h-.1c-.5.1-1 .5-1.2 1-.1.6 0 1.2.4 1.6z" />
                              </svg>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                version="1.2"
                                baseProfile="tiny"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M3.1 11.3l3.6 3.3-1 4.6c-.1.6.1 1.2.6 1.5.2.2.5.3.8.3.2 0 .4 0 .6-.1 0 0 .1 0 .1-.1l4.1-2.3 4.1 2.3s.1 0 .1.1c.5.2 1.1.2 1.5-.1.5-.3.7-.9.6-1.5l-1-4.6c.4-.3 1-.9 1.6-1.5l1.9-1.7.1-.1c.4-.4.5-1 .3-1.5s-.6-.9-1.2-1h-.1l-4.7-.5-1.9-4.3s0-.1-.1-.1c-.1-.7-.6-1-1.1-1-.5 0-1 .3-1.3.8 0 0 0 .1-.1.1l-1.9 4.3-4.7.5h-.1c-.5.1-1 .5-1.2 1-.1.6 0 1.2.4 1.6z" />
                              </svg>
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth={0}
                                version="1.2"
                                baseProfile="tiny"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M3.1 11.3l3.6 3.3-1 4.6c-.1.6.1 1.2.6 1.5.2.2.5.3.8.3.2 0 .4 0 .6-.1 0 0 .1 0 .1-.1l4.1-2.3 4.1 2.3s.1 0 .1.1c.5.2 1.1.2 1.5-.1.5-.3.7-.9.6-1.5l-1-4.6c.4-.3 1-.9 1.6-1.5l1.9-1.7.1-.1c.4-.4.5-1 .3-1.5s-.6-.9-1.2-1h-.1l-4.7-.5-1.9-4.3s0-.1-.1-.1c-.1-.7-.6-1-1.1-1-.5 0-1 .3-1.3.8 0 0 0 .1-.1.1l-1.9 4.3-4.7.5h-.1c-.5.1-1 .5-1.2 1-.1.6 0 1.2.4 1.6z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={review.reviewer_link}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="flex gap-1 text-yellow-500"
                        >
                          <FcGoogle size={28} />
                        </Link>
                      </div>
                      <p
                        className="  text-justify min-h-[150px]  md:min-h-[120px] md:text-start"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            review.review_text ?? "",
                            REVIEW_PURIFY_OPTS,
                          ),
                        }}
                      ></p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      </Container>
    </Fragment>
  );
};

export default Testimonials;
