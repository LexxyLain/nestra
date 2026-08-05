import { z } from 'zod'

export const applicationSchema = z
  .object({
    applicant_type: z.enum(['student', 'professional']),

    birth_date: z.string().min(1, 'Birth date is required.'),

    gender: z.enum([
      'female',
      'male',
      'non_binary',
      'prefer_not_to_say',
    ]),

    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number.')
      .max(30, 'Phone number is too long.'),

    current_address: z
      .string()
      .trim()
      .min(10, 'Enter your complete current address.')
      .max(500, 'Address is too long.'),

    school_name: z.string().trim().max(200).optional(),
    course_name: z.string().trim().max(200).optional(),
    student_number: z.string().trim().max(100).optional(),

    employer_name: z.string().trim().max(200).optional(),
    occupation: z.string().trim().max(200).optional(),

    emergency_contact_name: z
      .string()
      .trim()
      .min(2, 'Emergency contact name is required.')
      .max(200),

    emergency_contact_phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid emergency contact number.')
      .max(30),

    emergency_contact_relationship: z
      .string()
      .trim()
      .min(2, 'Relationship is required.')
      .max(100),

    preferred_move_in_date: z
      .string()
      .min(1, 'Preferred move-in date is required.'),

    preferred_room_type: z.enum([
      'single',
      'double',
      'shared',
      'no_preference',
    ]),

    reason_for_applying: z
      .string()
      .trim()
      .max(1000, 'Please keep your response under 1,000 characters.')
      .optional(),
  })
  .superRefine((data, context) => {
    if (data.applicant_type === 'student' && !data.school_name) {
      context.addIssue({
        code: 'custom',
        path: ['school_name'],
        message: 'School name is required for student applicants.',
      })
    }

    if (
      data.applicant_type === 'professional' &&
      !data.employer_name
    ) {
      context.addIssue({
        code: 'custom',
        path: ['employer_name'],
        message: 'Employer name is required for professional applicants.',
      })
    }
  })

export type ApplicationFormValues = z.infer<
  typeof applicationSchema
>