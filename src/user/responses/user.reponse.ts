import { ClassEntity } from 'src/class/entities/class.entity';
import { UserGender, UserRole, UserStatus } from '../enums/user.enum';
import * as moment from 'moment';

export class UserResponse {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  birthday: string;
  gender: UserGender;
  address: string;
  phone: string;
  avatar: string;
  status: UserStatus;
  role: UserRole;
  class: ClassEntity;

  constructor(data?: any) {
    this.user_id = data?.user_id || 0;
    this.email = data?.email || '';
    this.first_name = data?.first_name || '';
    this.last_name = data?.last_name || '';
    this.birthday = moment(data?.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY') || '';
    this.gender = data?.gender || 0;
    this.address = data?.address || '';
    this.phone = data?.phone || '';
    this.avatar = data?.avatar || '';
    this.status = data?.status || 0;
    this.role = data?.role || '';
    this.class = data?.class || {};
  }

  static mapToList(data?: any[]) {
    return data.map((item) => new UserResponse(item));
  }
}
