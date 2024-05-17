import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required("Please enter a password")
    .min(8, "Password must have at least 8 characters"),
});

export default loginSchema;
