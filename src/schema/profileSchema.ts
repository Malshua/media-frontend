import * as yup from "yup";
import { emailRegex, phoneRegex, stringRegex } from "./schemaRegex";

const objectShape = {
  value: yup.string().required("Please select an option"),
  label: yup.string().required("Please select an option"),
};

const objectAltShape = {
  value: yup.string(),
  label: yup.string(),
};

const userSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(phoneRegex, "Phone number is not valid")
    .min(8, "Enter a valid phone number")
    .required("Phone number is required"),
  position: yup.string().required("Position/Title is required"),
  companyName: yup.string().required("Company name is required"),
  industry: yup.object().shape(objectShape).required("Industry is required"),
  companyAddress: yup.string().required("Company address is required"),
});

const changePasswordSchema = yup.object().shape({
  old_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Old password is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export { userSchema, changePasswordSchema };
