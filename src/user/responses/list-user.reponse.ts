import { UserGender, UserRole, UserStatus } from '../enums/user.enum';
import * as moment from 'moment';

export class LitUserResponse {
  email: string;
  first_name: string;
  last_name: string;
  birthday: string;
  gender: UserGender;
  phone: string;
  class_name: string;

  constructor(data?: any) {
    this.email = data?.email || '';
    this.first_name = data?.first_name || '';
    this.last_name = data?.last_name || '';
    this.birthday = moment(data?.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY') || '';
    this.gender = data?.gender || 0;
    this.phone = data?.phone || '';
    this.class_name = data?.class?.name || '';
  }

  static mapToList(data?: any[]) {
    return data.map((item) => new LitUserResponse(item));
  }
}
