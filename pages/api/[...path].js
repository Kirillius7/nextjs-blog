import { StatusCodes } from "http-status-codes";

export default function handler(req, res) {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({
      success: false,
      code: StatusCodes.NOT_FOUND,
      message: "API route not found",
    });
}