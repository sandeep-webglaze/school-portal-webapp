import { Response } from "./types";
import { responseHandler } from "./errors";
import { ICity } from "./HomePage";
import { generateURI } from "@/helpers";

type CityFilters = {
  city?: string;
};
export async function getCities(
  filters?: CityFilters
): Promise<Response<ICity[]>> {
  const endpoint = generateURI(`/city`, filters);
  const res = await fetch(endpoint);
  return responseHandler(res);
}
