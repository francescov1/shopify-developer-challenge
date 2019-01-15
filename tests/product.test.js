"use strict";
const testProductId = "5c3cc522d66f9e150aee6c1e";
const unavailableProductId = "5c3bec3372f342e8d834a87a";

let testProductInventory;

describe("product tests", () => {
  test("get all products", () => {
    return global.agent.get("/api/products")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        for (let product of response.body) {
          expect(product.title).toBeDefined();
          expect(product.price).toBeGreaterThanOrEqual(0);
          expect(product.inventory).toBeGreaterThanOrEqual(0);
        }
      });
  });

  test("get all available products", () => {
    return global.agent.get("/api/products?available=true")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        for (let product of response.body) {
          expect(product.inventory).toBeGreaterThan(0);
        }
      });
  });

  test("get product", () => {
    return global.agent.get(`/api/products/${testProductId}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("Super Soaker");
        expect(response.body.price).toBe(19.99);

        testProductInventory = response.body.inventory;
      });
  });

  test("get unexisting product - error", () => {
    return global.agent.get("/api/products/5c33f0cedb3f90375e3c3be2")
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body.error.type).toBe("NotFoundError");
      });
  });

  test("purchase product", () => {
    return global.agent.post(`/api/products/${testProductId}`)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.inventory).toBe(testProductInventory - 1);
      });
  });

  test("purchase unavailable product", () => {
    return global.agent.post(`/api/products/${unavailableProductId}`)
      .then(response => {
        expect(response.statusCode).toBe(405);
        expect(response.body.error.type).toBe("NotAllowedError");
      });
  });

});
