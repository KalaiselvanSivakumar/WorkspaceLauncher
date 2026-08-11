import type { AppError as RawAppError } from "./models";

export type AppError = RawAppError & { message: string };
