import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodError, ZodType } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private _schema: ZodType) {}

  transform(value: unknown): unknown {
    try {
      return this._schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: fromZodError(error).message,
        });
      }

      throw new BadRequestException("Validation failed");
    }

    return value;
  }
}
