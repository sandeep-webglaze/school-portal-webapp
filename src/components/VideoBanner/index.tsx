import React from "react";
import { Container } from "../Container";

const VideoBanner = () => {
  return (
    <Container maxWidth="max-w-6xl">
      <div className=" text-center items-center">
        <h3 className=" text-center text-blacky-light font-bold  text-xl md:text-3xl lg:text-4xl ">
          Watch Our{" "}
          <span className="text-greenish-light">Introduction Video</span>
        </h3>
        <p className="text-center text-lg mb-8">
          Discover how Edhippo can help you find the perfect school for your
          child.
        </p>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/01odl690sug?si=6spJzjA7cnOcv939"
          title="Wedmoo Introduction Video"
          frameBorder="0"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </Container>
  );
};

export default VideoBanner;
