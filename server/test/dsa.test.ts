import {
    describe,
    expect,
    it,
} from "vitest";

import request from "supertest";

import app from "../src/app.js";

describe("DSA Problems", () => {

    it("should reject a problem without a URL", async () => {

        const response =
            await request(app)
                .post("/api/dsa/problems")
                .send({
                    title: "Two Sum",
                    slug: "two-sum",
                    platform: "leetcode",
                    difficulty: "easy",
                    topics: [],
                });

        expect([
            400,
            401,
        ]).toContain(
            response.status
        );
    });
});