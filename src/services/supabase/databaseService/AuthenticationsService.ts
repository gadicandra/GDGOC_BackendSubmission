import InvariantError from "../../../exceptions/InvariantError";
import { supabaseAdmin } from "../SupabaseServer";

export default class AuthenticationsService {
  async addRefreshToken(token: string) {
    const { data, error } = await supabaseAdmin
      .from('authentications')
      .insert({ token });

    if (error) {
      throw new InvariantError(error.message);
    }
  }

  async verifyRefreshToken(token: string) {
    const { data, error } = await supabaseAdmin
      .from('authentications')
      .select('token')
      .eq('token', token)
      .single();

    if (error) {
      throw new InvariantError(error.message);
    }

    if (!data) {
      throw new InvariantError('Gagal memverifikasi token. Token tidak ditemukan');
    }
  }

  async deleteRefreshToken(token: string) {
    const { data, error } = await supabaseAdmin
      .from('authentications')
      .delete()
      .eq('token', token);

    if (error) {
      throw new InvariantError(error.message);
    }
  }
}