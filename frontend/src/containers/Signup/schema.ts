import * as yup from "yup";

const signupSchema = yup.object().shape({
  firstName: yup.string().required("Last name is required"),
  lastName: yup.string().required("First name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Please enter a password")
    .min(8, "Password must have at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

export default signupSchema;
