import { Request, Response, NextFunction } from 'express';

export default class AuthenticationsHandler {
  private _authenticationsService : any;
  private _usersService : any;
  private _tokenManager : any;
  private _validator : any;

  constructor(authenticationsService : any, usersService : any, tokenManager : any, validator : any) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request: Request, res: Response, next: NextFunction) {
    try {
      this._validator.validatePostAuthenticationPayload(request.body);
      const { username, password } = request.body;
      const userId = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ userId });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return res.status(201).json({
        status: 'success',
        message: 'Authentication berhasil.',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Error in postAuthenticationHandler:', error);
      next(error);
    }
  }

  async putAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      this._validator.validatePutAuthenticationPayload(req.body);

      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ userId });

      return res.status(200).json({
        status: 'success',
        message: 'Access token berhasil diperbarui',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.body);

      const { refreshToken } = req.body;
      
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}