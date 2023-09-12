import { z } from "zod";

export const couponSchema = z.object({
  coupon: z
    .string({
      description: "The name of the coupon",
      required_error: "The Coupon Must have a name",
      invalid_type_error: "coupon name must be a string",
    })
    .min(1, "cannot be empty"),
  rank: z.enum(["best", "good", "bad"], {
    description: "The ranking given to the coupon",
    required_error: "a coupon must be ranked",
    invalid_type_error:
      "a coupon can only have one of three ranks, best, good or bad.",
  }),
});

type Coupon = z.infer<typeof couponSchema>;
export default Coupon;
