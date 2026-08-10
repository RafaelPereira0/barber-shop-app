import { config } from "dotenv";

config()

process.env.JWT_SECRET = process.env.JWT_SECRET
process.env.REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET

