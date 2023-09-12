import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import couponService from "../service/couponService";
import { couponSchema } from "../model/Coupon";
import Config from "../config";

const couponArraySchema = z.array(couponSchema);

const routes = (config: Config) => {
  const routes = Router();

  const idSchema = z.object({ id: z.string() });
  const { readCoupon, readAll, saveCoupon } = couponService(config);

  routes.get("/", async (req, res) => {
    console.log("params :", req.query);
    const params = idSchema.safeParse(req.query);
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
      res.json(data);
    } catch (e) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  routes.get("/all", async (_, res) => {
    try {
      const data = await readAll();
      if (data.length === 0) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }
      res.json(data.map(({ coupon, rank }) => ({ coupon, rank })));
    } catch (e) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  routes.get("/keys", async (_, res) => {
    try {
      const data = await readAll();
      if (data.length === 0) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }
      res.json(data.map(({ _id }) => _id));
    } catch (e) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  routes.post("/", async (req, res) => {
    const body = couponSchema.safeParse(req.body);
    if (!body.success) {
      const message = body.error.issues
        .map(({ message }) => message)
        .join("\n");
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

  routes.post("/many", async (req, res) => {
    const body = couponArraySchema.safeParse(req.body);
    if (!body.success) {
      const message = body.error.issues
        .map(({ message }) => message)
        .join("\n");
      res.status(StatusCodes.BAD_REQUEST).send(message);
      return;
    }
    try {
      const jobs = body.data.map((coupon) => saveCoupon(coupon));
      const keys = await Promise.all(jobs);
      res
        .status(StatusCodes.CREATED)
        .json(keys.filter((key) => key !== undefined));
    } catch (e) {
      console.log(e);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
  return routes;
};

export default routes;
