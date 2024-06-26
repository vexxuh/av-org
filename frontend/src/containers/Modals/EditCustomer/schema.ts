import * as yup from "yup";

const editCustomerSchema = yup.object().shape({
  name: yup.string().required(),
});

export default editCustomerSchema;
