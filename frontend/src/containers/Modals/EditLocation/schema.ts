import * as yup from "yup";

const editLocationSchema = yup.object().shape({
  name: yup.string().required(),
  customer: yup.string().required(),
});

export default editLocationSchema;
