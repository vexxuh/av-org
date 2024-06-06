import axios from "axios";
import { Paths } from "../config/paths";

export const editPageData = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}/${id}`
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
