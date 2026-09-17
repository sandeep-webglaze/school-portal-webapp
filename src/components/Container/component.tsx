interface ContainerProps {
  children: React.ReactNode;
  bgColor?: string;
  maxWidth?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  bgColor,
  maxWidth,
}) => {
  return (
    <div
      className={`
      ${bgColor ? bgColor : ""}
        ${maxWidth ?? "max-w-[1450px]"}
        mx-auto
        xl:px-16
        md:px-10
        sm:px-2
        px-4
        md:py-12
        py-6
      `}
    >
      {children}
    </div>
  );
};

export { Container };
