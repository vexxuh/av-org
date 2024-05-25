import * as yup from "yup";

const detailedAddSchema = yup.object().shape({
  manufacturer: yup.string().required(),
  deviceModel: yup.string().required(),
  serialNumber: yup.string().required(),
  primaryMAC: yup.string().required(),
  primaryIP: yup.string().required(),
  secondaryMAC: yup.string().required(),
  secondaryIP: yup.string().required(),
  hostname: yup.string().required(),
  firmware: yup.string().required(),
  password: yup.string().required(),
});

export default detailedAddSchema;
