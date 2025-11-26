import { nanoid } from "nanoid";
import bcrypt from 'bcrypt';
import InvariantError from "../../../exceptions/InvariantError";
import { supabaseAdmin } from "../SupabaseServer";


const validateUserPayload = ({ username, password, fullname }: { username: string, password:string, fullname:string }) => {
  // Check if required fields exist
  if (username === undefined || username === null) {
    throw new InvariantError('Gagal menambahkan user. Username wajib diisi');
  }
  if (password === undefined || password === null) {
    throw new InvariantError('Gagal menambahkan user. Password wajib diisi');
  }
  if (fullname === undefined || fullname === null) {
    throw new InvariantError('Gagal menambahkan user. Fullname wajib diisi');
  }

  // Check data types
  if (typeof username !== 'string') {
    throw new InvariantError('Gagal menambahkan user. Username harus berupa string');
  }
  if (typeof password !== 'string') {
    throw new InvariantError('Gagal menambahkan user. Password harus berupa string');
  }
  if (typeof fullname !== 'string') {
    throw new InvariantError('Gagal menambahkan user. Fullname harus berupa string');
  }

  // Check if strings are not empty
  if (username.trim() === '') {
    throw new InvariantError('Gagal menambahkan user. Username tidak boleh kosong');
  }
  if (password.trim() === '') {
    throw new InvariantError('Gagal menambahkan user. Password tidak boleh kosong');
  }
  if (fullname.trim() === '') {
    throw new InvariantError('Gagal menambahkan user. Fullname tidak boleh kosong');
  }
};

class UserRepository {
  async verifyNewUsername(username: string) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

    if (error) {
        throw new InvariantError(error.message);
    }

    if (data) {
        throw new InvariantError('Gagal menambahkan user. Username sudah terdaftar');
    }
    return true;
  }

  async addUser({ username, password, fullname }: { username: string, password:string, fullname:string }) {
    validateUserPayload({ username, password, fullname });

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
        .from('users')
        .insert({ id, username, password: hashedPassword, fullname })
        .select()
        .single();

    if (error) {
        throw new InvariantError(error.message);
    }

    return data;
  }

  async verifyUserCredential(username: string, password: string) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, password')
        .eq('username', username)
        .single();
  }

}