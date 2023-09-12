import { MongoClient, WithId } from "mongodb";
import Coupon, { couponSchema } from "../model/Coupon";

const url = "mongodb://db:27017";
const client = new MongoClient(url);

export const readCoupon = async (id: string) => {
  try {
    await client.connect();
    const db = client.db("groking");
    const collection = db.collection("coupons");
    const all = await collection.findOne<WithId<Coupon>>({ _id: id });
    return all || undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  } finally {
    client.close();
  }
};

const parseCouponStr = (str: string): Coupon | undefined => {
  const obj = JSON.parse(str);
  const result = couponSchema.safeParse(obj);
  if (!result.success) {
    return undefined;
  }
  return result.data;
};

export const readAll = async (): Promise<WithId<Coupon>[]> => {
  try {
    await client.connect();
    const db = client.db("groking");
    const collection = db.collection("coupons");
    const all = await collection.find<WithId<Coupon>>({}).toArray();
    console.log(all);
    return all;
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    client.close();
  }
};

export const saveCoupon = async (coupon: Coupon) => {
  try {
    await client.connect();
    const db = client.db("groking");
    const collection = db.collection("coupons");
    const inserted = await collection.insertOne(coupon);
    return inserted.acknowledged ? inserted.insertedId : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  } finally {
    client.close();
  }
};
