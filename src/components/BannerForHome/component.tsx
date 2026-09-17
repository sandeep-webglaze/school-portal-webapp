import React from "react";
import { Container } from "../Container";
import Image from "next/image";

const BannerForHome = () => {
  return (
    <section className=" bg-grayish-light">
      <Container bgColor="bg-grayish-light pt-0 pb-4 md:pt-0">
        <div className="  md:px-16 py-6  rounded-xl max-w-max m-auto ">
          <Image
            src={"/images/admissionbanner.png"}
            loading="lazy"
            width={1300}
            height={280}
            // Was q=100 and effectively requested at 3840px. A secondary promo
            // banner doesn't need lossless quality or a 4K variant — cap the
            // requested size with `sizes` and drop quality to 75.
            quality={75}
            sizes="(max-width: 768px) 100vw, 1300px"
            className="rounded-lg"
            alt={"EdHippo school admissions 2026-27 — free counselling"}
          />
        </div>
      </Container>
    </section>
  );
};

export default BannerForHome;
