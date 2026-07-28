import { Request, Response } from "express";
import { ZodError } from "zod";
import authService from "./auth.service.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordRequestSchema,
  changePasswordSchema,
} from "./auth.validations.js";

type ResetPasswordParams = {
  token: string;
};

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, message: error.issues[0].message });

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) return validationError(res, parsed.error);

      const result = await authService.register(parsed.data);

      return res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return validationError(res, parsed.error);

      const result = await authService.login(parsed.data);

      if (!result.success) {
        return res
          .status(result.status)
          .json({ success: result.success, message: result.message });
      }

      return res
        .cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: result.message,
          data: { accessToken: result.accessToken },
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const parsed = verifyEmailSchema.safeParse(req.body);
      if (!parsed.success) return validationError(res, parsed.error);

      const result = await authService.verifyEmail(parsed.data);

      return res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async resetPasswordRequest(req: Request, res: Response) {
    try {
      const parsed = resetPasswordRequestSchema.safeParse(req.body);
      if (!parsed.success) return validationError(res, parsed.error);

      const result = await authService.resetPasswordRequest(parsed.data);

      return res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async changeUserPassword(req: Request<ResetPasswordParams>, res: Response) {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) return validationError(res, parsed.error);

      const { token } = req.params;
      const result = await authService.changeUserPassword({
        token,
        password: parsed.data.password,
      });

      return res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async refreshAccessToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found. Please login again.",
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);

      if (!result.success) {
        return res
          .status(result.status)
          .json({ success: result.success, message: result.message });
      }

      return res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: { accessToken: result.accessToken },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(403)
          .json({ success: false, message: "Please login first to logout" });
      }

      await authService.logout(req.user.userId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
}

export default new AuthController();
