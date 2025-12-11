import { z } from "zod";

// Schemas mirroring the server-side validation
export const CreateIntentSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().min(3).max(3),
  name: z.string().min(1),
  email: z.string().email(),
  note: z.string().optional(),
  missionaryId: z.string().min(1),
  frequency: z.enum(["one-time", "monthly"])
});

export const ConfirmSchema = z.object({
  paymentIntentId: z.string(),
  missionaryId: z.string(),
  amount: z.number().int().positive(),
  currency: z.string().min(3).max(3),
  name: z.string(),
  email: z.string().email(),
  note: z.string().optional(),
  frequency: z.enum(["one-time", "monthly"])
});

// Mock API Service to simulate backend calls
export const api = {
  donations: {
    createIntent: async (data: z.infer<typeof CreateIntentSchema>) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = CreateIntentSchema.safeParse(data);
      if (!result.success) {
        throw new Error("Invalid donation details provided.");
      }

      // Return a mock client secret and intent ID
      return {
        clientSecret: "pi_mock_secret_" + Math.random().toString(36).substring(7),
        id: "pi_" + Math.random().toString(36).substring(7)
      };
    },

    confirm: async (data: z.infer<typeof ConfirmSchema>) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = ConfirmSchema.safeParse(data);
      if (!result.success) {
        throw new Error("Invalid confirmation data.");
      }

      return {
        success: true,
        donationId: "don_" + Math.random().toString(36).substring(7)
      };
    }
  }
};