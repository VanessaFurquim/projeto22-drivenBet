import httpStatus from "http-status";
import { testApi } from "./helpers/ApiConnection-helper";

describe("Health path test", () => {
    it("should return status OK (code 200) and text 'I'm ok!'", async () => {
        const response = await testApi.get("/health");
        
        expect(response.status).toBe(httpStatus.OK);
        expect(response.text).toBe("I'm ok!");
    });
});