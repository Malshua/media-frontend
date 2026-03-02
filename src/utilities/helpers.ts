import crypto from "crypto";
import copy from "copy-to-clipboard";
import moment from "moment";
import { FileMetadata } from "@/components/widgets/DragnDropMulti";

interface EncryptionProps {
  dataToEncrypt: Record<string, unknown>; // Define the type more specifically
  secretKey: string;
  iv: Buffer;
}

// const JWT_KEY = process.env.JWT_SECRET as string; // Assert JWT_KEY as string

// if (!JWT_KEY) {
//   throw new Error('JWT_SECRET is not defined');
// }

// Utility Functions
export const getFirstLetters = (str: string | undefined): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
};

export const createFormData = (pdfFiles: FileMetadata[]) => {
  const formData = new FormData();

  pdfFiles.forEach(({ file }) => {
    if (file) {
      formData.append("files", file);
    }
  });

  return formData;
};

export const getFileURL = (key?: string | string[]) => {
  const file = `https://coceptual-bucket.s3.eu-north-1.amazonaws.com/${
    key || ""
  }`;
  return file;
};

// export const getImage = (key?: string | undefined | null) => {
//   const img: any = key ? `${process.env.SRC_URL}/${key}` : logo;
//   return img;
// };

export const getDayDifference = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date";
  }

  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
};

export const sanitizePrice = (price: string) =>
  price.replace(/[\$,+\s]/g, "").replace(/,/g, "");

export const extractFirstPath = (url: string) => {
  // Split the URL string by '/'
  const urlParts = url.split("/");

  // The base URL is constructed by joining the first three parts
  const baseUrl = textReplacer(urlParts[1], "-");

  return baseUrl;
};

export const getFirstWord = (words: string) => {
  // Split the sentence string by a space
  const wordsArray = words?.split(" ");

  if (!wordsArray) return;

  // The word is constructed
  const word = wordsArray[0];

  return word;
};

export const textReplacer = (value: string, replaceItem: string): string => {
  return value.replaceAll(replaceItem, " ");
};

export const truncateText = (text: string, len: number): string => {
  return text.length > len ? `${text.substring(0, len)}...` : text;
};

export const moneyFormat = (amount: number): string => {
  return amount ? new Intl.NumberFormat().format(amount) : "0";
};

// Type for converToBuffer parameter
interface BufferConversionProps {
  stringValue: string;
  integerValue: number;
}

export const converToBuffer = async ({
  stringValue,
  integerValue,
}: BufferConversionProps): Promise<Buffer> => {
  const hexValues = stringValue
    .replace("<Buffer ", "")
    .replace(">", "")
    .split(" ");
  const buffer = Buffer.from(
    hexValues.map((value: string) => parseInt(value, integerValue))
  );
  return buffer;
};

export const formatDateAndTime = (date: moment.MomentInput) => {
  const value = {
    Date: moment(date).format("DD MMMM, YYYY"),
    Time: moment(date).format("h:mm a").toLocaleLowerCase(),
  };

  return value;
};

export const copyText = (text: string) => {
  copy(text);
};

export const getFullDate = (date: moment.MomentInput) => {
  const value = moment(date).format("DD MMMM, YYYY");
  return value;
};

export const subtractYears = (date: any, years: number) => {
  date.setFullYear(date.getFullYear() - years);
  return date;
};

export function capitalizeFirstLetter(word: any) {
  if (word) return word?.charAt(0).toUpperCase() + word?.slice(1);
}

export function capitalizeFirstLetters(word: string): string {
  if (!word) return "";
  return word
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w?.slice(1))
    .join(" ");
}
