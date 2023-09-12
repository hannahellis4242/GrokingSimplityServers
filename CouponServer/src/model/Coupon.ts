import { z } from "zod";

export const couponSchema = z.object({
  name: z
    .string({
      description: "The name of the coupon",
      required_error: "The Coupon Must have a name",
      invalid_type_error: "coupon name must be a string",
    })
    .min(1, "cannot be empty"),
  link: z.optional({ type }),
});
