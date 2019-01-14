"use strict";
const testProductId1 = "5c3cc522d66f9e150aee6c1e";
const testProductId2 = "5c3cc537d66f9e150aee6c1f";
const testProductId3 = "5c3cc54cd66f9e150aee6c20";
const unavailableProductId = "5c3bec3372f342e8d834a87a";

let testCartId;

describe("shopping cart tests", () => {

  test("create cart", () => {
    return global.agent.post("/api/carts")
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.products.length).toBe(0);
        expect(response.body.state).toBe("pending");
        expect(response.body.total).toBe(0);
        testCartId = response.body._id;
      });
  });

  test("get unexisting cart - error", () => {
    return global.agent.get(`/api/carts/5c3783d5a55f01814561cf9b`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body.error.type).toBe("NotFoundError");
      });
  });

  test("add products to cart", () => {
    return global.agent.post(`/api/carts/${testCartId}`)
      .send({ products: [testProductId1, testProductId2, testProductId3] })
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.products.length).toBe(3);
        expect(response.body.products[0]._id).toBe(testProductId1);

        let total = 0;
        for (let product of response.body.products) {
          total += product.price;
        }

        expect(response.body.total).toBe(total);
      });
  });

  test("remove product from cart", () => {
    return global.agent.delete(`/api/carts/${testCartId}/products/${testProductId1}`)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.products.length).toBe(2);

        let total = 0;
        for (let product of response.body.products) {
          total += product.price;
        }

        expect(response.body.total).toBe(total);
      });
  });

  test("get cart", () => {
    return global.agent.get(`/api/carts/${testCartId}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test("complete cart", () => {
    return global.agent.post(`/api/carts/${testCartId}/complete`)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.state).toBe("complete");
      });
  });
})
