import bcrypt from 'bcryptjs';

class Bcrypt {
  async salt() {
    return await bcrypt.genSalt(10);
  }

  async hashPassword(password) {
    const hash = await bcrypt.hash(password, await this.salt());
    return hash;
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

export const HashFactory = new Bcrypt();
