import * as yup from "yup";

const quickAddSchema = yup.object().shape({
  manufacturer: yup.string().required(),
  deviceModel: yup.string().required(),
  serialNumber: yup.string().required(),
  primaryMAC: yup.string().required(),
});

export default quickAddSchema;
