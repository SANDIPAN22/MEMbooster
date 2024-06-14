import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

// first function will return the second function which is the actual middleware
const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      console.error("ZOD VALIDATION FAILED", e);
      return res.status(400).send(e.errors).end();
    }
  };

export default validateRequest;
