import {
    describe,
    expect,
    it,
} from "vitest";

import request from "supertest";

import app from "../src/app.js";

describe("Authentication protection", () => {

    it("should reject protected routes without a token", async () => {

        const response =
            await request(app)
                .get("/api/dashboard");

        expect(response.status)
            .toBe(401);

        expect(response.body.success)
            .toBe(false);
    });


    it("should reject an invalid token", async () => {

        const response =
            await request(app)
                .get("/api/dashboard")
                .set(
                    "Authorization",
                    "Bearer invalid-token"
                );

        expect(response.status)
            .toBe(401);

        expect(response.body.success)
            .toBe(false);
    });
});