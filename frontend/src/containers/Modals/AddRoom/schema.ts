import * as yup from "yup";

const addRoomSchema = yup.object().shape({
  name: yup.string().required(),
  customer: yup.string().required(),
  location: yup.string().required(),
});

export default addRoomSchema;
