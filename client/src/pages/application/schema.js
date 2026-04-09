import { z } from 'zod';

const kenyaPhoneRegex = /^(?:\+?254|0)(?:7|1)\d{8}$/;
const githubUsernameRegex = /^[a-zA-Z0-9-]{1,39}$/;

const optionalText = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}, z.string().optional());

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z
    .string()
    .trim()
    .regex(kenyaPhoneRegex, 'Must be a valid Kenyan phone number (e.g. 07xx or 01xx)'),
  email: z.string().trim().email('Must be a valid email address'),
  githubUsername: z
    .string()
    .trim()
    .regex(githubUsernameRegex, 'Alphanumeric characters and hyphens only, 1-39 chars'),
  currentLevelOfStudy: z.string().min(1, "Please select level of study"),
  institution: optionalText,
  device: z.string().refine(val => val !== "I don't have a laptop yet", {
    message: "A laptop or desktop is required. Phone only is not sufficient."
  }),
  selectedTrack: z.enum(['backend', 'frontend', 'both'], { required_error: "Please select a track" }),
  experienceLevel: z.enum(['zero', 'some', 'basic', 'intermediate'], { required_error: "Please select your experience level" }),
  motivation: z.string().trim().superRefine((val, ctx) => {
    const words = val.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Motivation must be at least 50 words. Current count: ${words.length}`,
      });
    }
  }),
  vision: optionalText,
  referralSource: optionalText,
  attendanceConstraints: optionalText,
  agreedToLaptop: z.boolean().refine(Boolean, { message: "You must confirm laptop access" }),
  agreedToAttendance: z.boolean().refine(Boolean, { message: "You must commit to attendance" }),
  agreedToGitHub: z.boolean().refine(Boolean, { message: "You must agree to GitHub workflow" }),
  agreedToFees: z.boolean().refine(Boolean, { message: "You must agree to the fee structure" }),
  agreedToTerms: z.boolean().refine(Boolean, { message: "You must accept Terms of Service" }),
});

export const defaultValues = {
  fullName: '',
  phoneNumber: '',
  email: '',
  githubUsername: '',
  currentLevelOfStudy: '',
  institution: '',
  device: '',
  selectedTrack: '',
  experienceLevel: '',
  motivation: '',
  vision: '',
  referralSource: '',
  attendanceConstraints: '',
  agreedToLaptop: false,
  agreedToAttendance: false,
  agreedToGitHub: false,
  agreedToFees: false,
  agreedToTerms: false,
};
