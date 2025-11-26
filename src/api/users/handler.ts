import { Request, Response, NextFunction } from "express";

export default class UsersHandler {
  private _service : any;
  private _validator : any;

  constructor(service : any, validator : any) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request: Request, res: Response, next: NextFunction){
    try {
      this._validator.validatePostUserPayload(request.body);
      
      const { username, password, fullname } = request.body;
      const userId = await this._service.addUser({ username, password, fullname });
      
      return res.status(201).json({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
    } catch (error) {
      console.error('Error in postUserHandler:', error);
      next(error);
    }
  }
}