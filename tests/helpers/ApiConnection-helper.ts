import supertest from "supertest";
import app from "@/app";

export const testApi = supertest(app);