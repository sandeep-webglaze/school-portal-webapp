"use client";

import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
  border?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ src, border = false }) => {
  return (
    <Image
      className={`rounded-full ${
        border && "border"
      } w-7 h-7 object-cover rounded-full`}
      height="30"
      width="30"
      alt="Avatar"
      src={src || "/images/placeholder.webp"}
    />
  );
};

export default Avatar;
