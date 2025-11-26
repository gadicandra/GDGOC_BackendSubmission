import { supabaseAdmin } from '../SupabaseServer';
import InvariantError from '../../../exceptions/InvariantError';
import NotFoundError from '../../../exceptions/NotFoundError';
import { Request } from 'express';
import AuthorizationError from '../../../exceptions/AuthorizationError';

interface MenuPayload {
  name: string;
  category: string;
  calories: number;
  price: number;
  ingredients: string[];
  description: string;
  owner: string;
}

interface MenuQueryParams {
  q?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  max_cal?: string;
  page?: string;
  per_page?: string;
  sort?: string;
  mode?: string;
  per_category?: string;
}

export default class MenusService {
  async addMenu({ name, category, calories, price, ingredients, description, owner }: MenuPayload) {

    const { data, error } = await supabaseAdmin
      .from('menu')
      .insert({ name, category, calories, price, ingredients, description, owner })
      .select()
      .single();

    if (error) {
        console.error('Supabase Insert Error:', error);
        throw new InvariantError(error.message);
    }

    if (!data) {
      throw new InvariantError('Gagal menambahkan menu');
    }

    return data;
  }

  async getAllMenus() {
    const { data } = await supabaseAdmin
      .from('menu')
      .select('id, name, category, calories, price, ingredients, description, created_at, updated_at');

    if (!data) {
      throw new InvariantError('Gagal mengambil menu');
    }

    return data;
  }

  async getMenuById(id: string) {
    const { data } = await supabaseAdmin
      .from('menu')
      .select('id, name, category, calories, price, ingredients, description')
      .eq('id', id)
      .single();

    if (!data) {
      throw new NotFoundError('Menu tidak ditemukan');
    }

    return data;
  }

  async getMenusByQuery(req: Request){
    const queryParams = req.query as unknown as MenuQueryParams;
    const {
      q = '',
      category = '',
      min_price = '0',
      max_price = '1000000',
      max_cal = '1000',
      page = '1',
      per_page = '5',
      sort = 'created_at:desc'
    } = queryParams;
  

    // Convert query parameters to numbers
    const pageInt = parseInt(page);
    const perPageInt = parseInt(per_page);
    const minPriceInt = min_price ? parseInt(min_price) : 0;
    const maxPriceInt = max_price ? parseInt(max_price) : 1000000;
    const maxCalInt = max_cal ? parseInt(max_cal) : 1000;

    let query = supabaseAdmin
      .from('menu')
      .select('id, name, category, calories, price, ingredients, description', { count: 'exact' });

    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Category
    if (category) {
      query = query.eq('category', category);
    }

    // Filter Harga
    if (minPriceInt) {
      query = query.gte('price', minPriceInt); 
    }

    if (maxPriceInt) {
      query = query.lte('price', maxPriceInt);
    }

    // Filter Kalori
    if (maxCalInt) {
      query = query.lte('calories', maxCalInt);
    }

    // Pagination
    const from = (pageInt - 1) * perPageInt;
    const to = from + perPageInt - 1;
    
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw new InvariantError(error.message);

    return {
      data,
      pagination: {
        total: Number(count),
        page: pageInt,
        per_page: perPageInt,
        total_pages: Math.ceil(Number(count) / perPageInt)
      }
    };
  }

  async getMenusByCategoryMode(queryParams: any) {
    const {
      mode = 'list',
      per_category = '5',
    } = queryParams;

    const limit = parseInt(per_category as string, 10) || 5;

    if (mode === 'list') {
      return this.getMenusByList(limit);
    }

    if (mode === 'count') {
      return this.getMenusByCategoryCount();
    }

    return this.getMenusByList(limit);
  }

  async getMenusByCategoryCount() {
    const { data, error } = await supabaseAdmin
      .from('menu')
      .select('category')

    if (error) {
      throw new InvariantError(error.message);
    }

    const categoryCounts :Record<string, number> = {};

    data.forEach((menu) => {
      const category = menu.category;
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    })

    return categoryCounts;
  }

  async getMenusByList(limit: number) {
    const { data, error } = await supabaseAdmin
      .from('menu')
      .select('id, name, category, price')
      .order('category')

    if (error) {
      throw new InvariantError(error.message);
    }

    if (!data) return {};

    const groupedData: Record<string, any> = {};
    data.forEach((menu) => {
      const category = menu.category;

      if (!groupedData[category]) {
        groupedData[category] = []
      }

      if (groupedData[category].length < limit) {
        groupedData[category].push(menu);
      }
    })

    return groupedData;
  }

  async editMenuById(id: string, {name, category, calories, price, ingredients, description, owner}
    : MenuPayload) {
    
    const { data:menu, error:fetchError } = await supabaseAdmin
      .from('menu')
      .select('owner')
      .eq('id', id)
      .single();

    if (fetchError || !menu) {
      throw new NotFoundError('Menu tidak ditemukan');
    }

    if(menu.owner === null || menu.owner === "undefined"){
      throw new AuthorizationError('Anda tidak berhak menghapus menu ini');
    }

    let realOwner;
    try {
      realOwner = typeof menu.owner === 'string' ? JSON.parse(menu.owner) : menu.owner;
    } catch (e) {
      throw new AuthorizationError('Data owner tidak valid');
    }

    if (String(realOwner) !== String(owner)) {
      console.log('Owner mismatch:', { realOwner, owner, types: { real: typeof realOwner, input: typeof owner } });
      throw new AuthorizationError('Anda tidak berhak mengedit menu ini');
    }

    console.log("tes")

    const updatedAt = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('menu')
      .update({ name, category, calories, price, ingredients, description, updated_at: updatedAt })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new InvariantError(error.message);
    }

    return data;
  }

  async deleteMenuById(id: string, owner: string) {
    const { data: menu, error:fetchError } = await supabaseAdmin
      .from('menu')
      .select('owner')
      .eq('id', id)
      .single();

    if (fetchError || !menu) {
      throw new NotFoundError('Menu tidak ditemukan');
    }

    let realOwner;
    try {
      realOwner = typeof menu.owner === 'string' ? JSON.parse(menu.owner) : menu.owner;
    } catch (e) {
      throw new AuthorizationError('Data owner tidak valid');
    }

    if (String(realOwner) !== String(owner)) {
      console.log('Owner mismatch:', { realOwner, owner, types: { real: typeof realOwner, input: typeof owner } });
      throw new AuthorizationError('Anda tidak berhak mengedit menu ini');
    }

    const { data, error } = await supabaseAdmin
      .from('menu')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new InvariantError(error.message);
    }

    return data;
  }
}