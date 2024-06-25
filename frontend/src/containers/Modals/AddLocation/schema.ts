import * as yup from "yup";

const addLocationSchema = yup.object().shape({
  name: yup.string().required(),
  customer: yup.string().required(),
});

export default addLocationSchema;
