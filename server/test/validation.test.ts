import {
    describe,
    expect,
    it,
} from "vitest";

import request from "supertest";

import app from "../src/app.js";

describe("Validation", () => {

    it("should reject an invalid roadmap ID", async () => {

        const response =
            await request(app)
                .get(
                    "/api/roadmaps/not-a-valid-id"
                );

        expect(response.status)
            .toBe(401);
    });
});