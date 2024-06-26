import * as yup from "yup";

const editRoomSchema = yup.object().shape({
  name: yup.string().required(),
  customer: yup.string().required(),
  location: yup.string().required(),
});

export default editRoomSchema;
