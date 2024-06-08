import * as yup from "yup";

const quickAddSchema = yup.object().shape({
  manufacturer: yup.string().required(),
  device_model: yup.string().required(),
  serial_number: yup.string().required(),
  password: yup.string().required(),
  location: yup.string().required(),
  room: yup.string().required(),
});

export default quickAddSchema;
