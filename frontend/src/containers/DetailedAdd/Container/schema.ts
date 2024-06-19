import * as yup from "yup";

const detailedAddSchema = yup.object().shape({
  manufacturer: yup.string().required(),
  device_model: yup.string().required(),
  serial_number: yup.string().required(),
  primary_mac: yup.string().required(),
  primary_ip: yup.string().required(),
  secondary_mac: yup.string().required(),
  secondary_ip: yup.string().required(),
  hostname: yup.string().required(),
  firmware: yup.string().required(),
  password: yup.string().required(),
  location: yup.string().required(),
  room: yup.string().required(),
  customer: yup.string().required(),
});

export default detailedAddSchema;
