import { Expose } from 'class-transformer';
import { Role } from 'src/auth/enums/role.enum';

export class UserSerializer {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  constructor(partial: Partial<UserSerializer>) {
  Object.assign(this, partial);
  }

}
