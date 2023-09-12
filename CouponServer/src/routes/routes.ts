import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { readAll, readCoupon, saveCoupon } from "../service/coupons";
import { couponSchema } from "../model/Coupon";

const routes = Router();

const idSchema = z.object({ id: z.coerce.string() });

routes.get("/", async (req, res) => {
  const params = idSchema.safeParse(req.params);
  if (!params.success) {
    res.status(StatusCodes.BAD_REQUEST).send(params.error.issues);
    return;
  }
  try {
    const data = await readCoupon(params.data.id);
    if (!data) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(JSON.parse(data));
  } catch (e) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

routes.get("/all", async (req, res) => {
  try {
    const data = await readAll();
    if (data.length === 0) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(data);
  } catch (e) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

routes.post("/", async (req, res) => {
  const body = couponSchema.safeParse(req.body);
  if (!body.success) {
    const message = body.error.issues.map(({ message }) => message).join("\n");
    res.status(StatusCodes.BAD_REQUEST).send(message);
    return;
  }
  try {
    const key = await saveCoupon(body.data);
    res.status(StatusCodes.CREATED).send(key);
  } catch (e) {
    console.log(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

export default routes;
