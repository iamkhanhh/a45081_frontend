import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  id?: number;
  // username: string;
  password: string;
  // fullname: string;
  email: string;
  pic?: string;
  role: string;
  // occupation: string;
  // companyName: string;
  phone_number: string;
  address: string;
  institution: string;
  // socialNetworks?: SocialNetworksModel;
  // personal information
  first_name: string;
  last_name: string;
  status: string;
  // website: string;
  // account information
  // language: string;
  // timeZone: string;
  // communication: {
  //   email: boolean;
  //   sms: boolean;
  //   phone: boolean;
  // };
  // email settings
  // emailSettings?: {
  //   emailNotification: boolean;
  //   sendCopyToPersonalEmail: boolean;
  //   activityRelatesEmail: {
  //     youHaveNewNotifications: boolean;
  //     youAreSentADirectMessage: boolean;
  //     someoneAddsYouAsAsAConnection: boolean;
  //     uponNewOrder: boolean;
  //     newMembershipApproval: boolean;
  //     memberRegistration: boolean;
  //   };
  //   updatesFromKeenthemes: {
  //     newsAboutKeenthemesProductsAndFeatureUpdates: boolean;
  //     tipsOnGettingMoreOutOfKeen: boolean;
  //     thingsYouMissedSindeYouLastLoggedIntoKeen: boolean;
  //     newsAboutMetronicOnPartnerProductsAndOtherServices: boolean;
  //     tipsOnMetronicBusinessProducts: boolean;
  //   };
  // };

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    // this.username = user.username || '';
    this.first_name = user.first_name || '';
    this.last_name = user.last_name || '';
    this.password = user.password || '';
    // this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = './assets/media/avatars/blank.png';
    this.role = user.role || 'User';
    // this.occupation = user.occupation || '';
    // this.companyName = user.companyName || '';
    this.phone_number = user.phone_number || '';
    this.status = user.status || 'active';
    this.address = user.address || '';
    this.institution = user.institution || '';
    // this.socialNetworks = user.socialNetworks;
  }
}
