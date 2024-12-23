import * as bcrypt from 'bcrypt';

export default class GeneratePasswordService {
  async createHash(password: string) {
    const salt = await bcrypt.genSalt(6);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
