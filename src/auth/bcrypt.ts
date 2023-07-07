import bcryptjs from "bcryptjs";

export function hashPassword(password: string): string {
  const salt = bcryptjs.genSaltSync(12);
  return bcryptjs.hashSync(password, salt);
}

export function compareHash(password: string, hashed: string): boolean {
  return bcryptjs.compareSync(password, hashed);
}
