import { Hono } from "hono";
import { createLoan, getLoans } from "../controllers/loans.controller";

const loans = new Hono();

loans.get("/", getLoans);
loans.post("/", createLoan);

export default loans;
