import { createClient } from "redis";
import { Either } from "typescript-monads";

const client = createClient({
  url: "redis://redis:6379",
});

const left = <L, R>(x: L) => new Either<L, R>(x, undefined);
const right = <L, R>(x: R) => new Either<L, R>(undefined, x);

export const getCoupon = async (id: string) => {
  try {
    await client.connect();
    return await client.get(id);
  } catch (e) {
    console.error(e);
    return undefined;
  } finally {
    console.log("disconnect called");
    client.disconnect();
  }
};

export const saveCoupon = async();
