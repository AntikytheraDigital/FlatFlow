import "@testing-library/jest-dom";
import { ssgHelper } from "@/server/api/helpers/ssgHelper";

const ssg = await ssgHelper();

test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});
