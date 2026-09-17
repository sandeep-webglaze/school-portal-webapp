import { Fragment } from "react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

/**
 * Page-level heading.
 *
 * Previously the subtitle was rendered as <h2>, which polluted every page
 * that mounted <Heading> (notably the school detail page) with a second
 * heading level used purely for visual styling. That confuses crawlers and
 * accessibility tools — h2 should mark a real section, not act as a
 * subheading. Subtitle is now a styled <p> so the hierarchy stays clean:
 *   <h1>School Name</h1>
 *   <p>City, state</p>
 */
const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <p className="font-light text-neutral-500 mt-2 capitalize text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
};

type ColorHeadingProps = {
  greenText: string;
  mt?: boolean;
} & HeadingProps;

/**
 * Section heading used inside content blocks (About page, Contact page,
 * homepage stats, etc.). Previously this rendered as <h3> which skipped
 * the <h2> level — Google flags skipped heading levels as an a11y/SEO
 * issue. Use <h2> here so the hierarchy is: <h1> → <h2> (section) →
 * <h3> (subsection).
 */
const ColoredHeading: React.FC<ColorHeadingProps> = ({
  title,
  subtitle,
  center = false,
  greenText,
  mt = true,
}) => (
  <Fragment>
    <h2
      className={` text-xl md:text-3xl lg:text-4xl font-bold  text-gray-700 ${
        mt && "mt-6"
      } ${center ? "text-center" : "text-start"} `}
    >
      {title} <span className="text-greenish-light">{greenText}</span>
    </h2>
    {subtitle && (
      <p
        className={`${
          center ? "text-center" : "text-start"
        }  mt-1 text-sm md:text-lg font-light text-gray-500"`}
      >
        {subtitle}
      </p>
    )}
  </Fragment>
);

export { Heading, ColoredHeading };
