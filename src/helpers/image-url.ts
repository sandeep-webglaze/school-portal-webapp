import { IMAGES_HOST } from "@/constants/server";

function validateUrl(url: string | URL) {
  try {
    if (url === "") return false;
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export function getImageUrl(src: string) {
  if (validateUrl(src)) return src;
  return IMAGES_HOST + src;
}
