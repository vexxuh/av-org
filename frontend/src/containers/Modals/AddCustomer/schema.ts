import * as yup from "yup";

const addCustomerSchema = yup.object().shape({
  name: yup.string().required(),
});

export default addCustomerSchema;
