import { MongoClient, ObjectId, WithId } from "mongodb";
import Coupon from "../model/Coupon";
import Config from "../config";

const couponService = ({ DB_HOST }: Config) => {
  const url = `mongodb://${DB_HOST}:27017`;
  const client = new MongoClient(url);

  const readCoupon = async (id: string) => {
    try {
      await client.connect();
      const db = client.db("groking");
      const collection = db.collection("coupons");
      const found = await collection.findOne<WithId<Coupon>>({
        _id: new ObjectId(id),
      });
      return found || undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    } finally {
      client.close();
    }
  };

  const readAll = async (): Promise<WithId<Coupon>[]> => {
    try {
      await client.connect();
      const db = client.db("groking");
      const collection = db.collection("coupons");
      const all = await collection.find<WithId<Coupon>>({}).toArray();
      return all;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      client.close();
    }
  };

  const saveCoupon = async (coupon: Coupon) => {
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
  return { readCoupon, readAll, saveCoupon };
};

export default couponService;
