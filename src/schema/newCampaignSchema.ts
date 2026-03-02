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

const newCampaign = yup.object().shape({
  campaignName: yup.string().required("Campaign name is required"),
  campaignType: yup
    .object()
    .shape(objectShape)
    .required("Campaign type is required"),
  startDate: yup.date().required("Start date is required!"),
  endDate: yup.date().required("End date is required!"),
  campaignDescription: yup
    .string()
    .required("Campaign description is required"),
  //   budget: yup.string().required("Budget is required"),
  totalBudget: yup.string().required("Total budget is required"),
  primaryGoal: yup
    .object()
    .shape(objectShape)
    .required("Primary goal is required"),
  targetAudience: yup
    .array()
    .of(yup.string())
    .transform((value, originalValue) => {
      if (Array.isArray(originalValue)) {
        return originalValue.map((item: any) => item.value);
      }
      return [];
    })
    .min(1, "At least one target audience is required"),
  location: yup.string().required("Location is required"),
  keyPerformanceIndicators: yup
    .string()
    .required("Performance indicators required"),
  instructionsRequirements: yup
    .string()
    .required("Instruction requirements required"),
  callToAction: yup.string().required("Instruction requirements required"),
  preferredTimeline: yup.string().required("Instruction requirements required"),
});

export { newCampaign };
