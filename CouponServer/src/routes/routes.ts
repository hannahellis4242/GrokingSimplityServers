import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { getCoupon } from "../service/coupons";

const routes = Router();

const idSchema = z.object({ id: z.coerce.string() });

routes.get("/", async (req, res) => {
  const params = idSchema.safeParse(req.params);
  if (!params.success) {
    res.status(StatusCodes.BAD_REQUEST).send(params.error.issues);
    return;
  }
  try {
    const data = await getCoupon(params.data.id);
    if (!data) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(JSON.parse(data));
  } catch (e) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

export default routes;
