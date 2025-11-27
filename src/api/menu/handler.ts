import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  auth: {
    credentials: {
      id: string;
    };
  };
}

export default class MenusHandler {
  private _service: any;
  private _validator: any;

  constructor(service: any, validator: any) {
    this._service = service;
    this._validator = validator;

    this.postMenuHandler = this.postMenuHandler.bind(this);
    this.getMenusHandler = this.getMenusHandler.bind(this);
    this.getMenusByCategoryModeHandler = this.getMenusByCategoryModeHandler.bind(this);
    this.getMenuByIdHandler = this.getMenuByIdHandler.bind(this);
    this.editMenuByIdHandler = this.editMenuByIdHandler.bind(this);
    this.deleteMenuByIdHandler = this.deleteMenuByIdHandler.bind(this);
  }

  async postMenuHandler(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      this._validator.validateAddMenuPayload(request.body);
      const { name, category, calories, price, ingredients, description } = request.body;
      const { id: credentialId } = request.auth.credentials;

      const returnedMenu = await this._service.addMenu({
        name,
        category,
        calories,
        price,
        ingredients,
        description,
        owner: credentialId,
      });
      
      response.status(201).json({
        status: 'success',
        message: 'Menu successfully added',
        data: returnedMenu,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenusHandler(request: Request, response: Response, next: NextFunction) {
    try {
      console.log('🔍 request.query:', request.query);
      console.log('🔍 typeof request.query:', typeof request.query);
      console.log('🔍 keys:', Object.keys(request.query));
    
      const hasQueryParams = Object.keys(request.query).length > 0;
      console.log('🔍 hasQueryParams:', hasQueryParams);
    
      if (hasQueryParams) {
        console.log('📤 Calling getMenusByQuery with:', request.query);
        const result = await this._service.getMenusByQuery(request.query);
        return response.status(200).json({
          status: 'success',
          ...result
        });
      }
      
      const menus = await this._service.getAllMenus();
      response.status(200).json({
        status: 'success',
        data: menus,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenusByCategoryModeHandler(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await this._service.getMenusByCategoryMode(request.query);
      response.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenuByIdHandler(request: Request, response: Response, next: NextFunction) {
    try {
      const menu = await this._service.getMenuById(request.params.id);
      response.status(200).json({
        status: 'success',
        data: menu
      });
    } catch (error) {
      next(error);
    }
  }

  async editMenuByIdHandler(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      this._validator.validateEditMenuPayload(request.body);
      const { name, category, calories, price, ingredients, description } = request.body;
      const { id: credentialId } = request.auth.credentials;

      const returnedMenu = await this._service.editMenuById(request.params.id, {
        name,
        category,
        calories,
        price,
        ingredients,
        description,
        owner: credentialId,
      });
      
      response.status(200).json({
        status: 'success',
        message: 'Menu berhasil diubah',
        data: returnedMenu
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMenuByIdHandler(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      const menu = await this._service.deleteMenuById(request.params.id, request.auth.credentials.id);
      response.status(200).json({
        status: 'success',
        message: 'Menu berhasil dihapus',
        data: menu
      });
    } catch (error) {
      next(error);
    }
  }
}