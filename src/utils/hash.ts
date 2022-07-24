import { scrypt, randomBytes } from 'node:crypto';

export class Hash {
  private static async hash(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  static generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  static async password(password: string): Promise<string> {
    const salt = Hash.generateSalt();
    const hash = await Hash.hash(password, salt);
    return `${salt}:${hash}`;
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    const [salt, hashed] = hash.split(':') as [string, string];
    const hashCheck = await Hash.hash(password, salt);
    return hashed === hashCheck;
  }
}
