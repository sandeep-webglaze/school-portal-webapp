import { FC } from "react";
import { DotLoader } from "react-spinners";
type LoaderProps = {
  size?: number;
};
const Loader: FC<LoaderProps> = ({ size }) => {
  return <DotLoader color="#1daf68" />;
};

export default Loader;
