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

const loginSchema = yup.object().shape({
  contact_email: yup
    .string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const userDetailsSchema = yup.object().shape({
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

const ForgotSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
});

const PasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export {
  loginSchema,
  resetPasswordSchema,
  userDetailsSchema,
  ForgotSchema,
  PasswordSchema,
};
