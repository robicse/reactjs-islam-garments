import { types, flow } from 'mobx-state-tree';
import { Permissions } from './permissions';
import { baseUrl } from '../const/api';


const UserInfo = types.model('UserInfo', {
  id: types.number,
  name: types.string,
  phone: types.string,
  email: types.maybeNull(types.string),
  status: types.number,
  created_at: types.string,
  updated_at: types.string,
  role: types.string,
  token: types.string,
  warehouse_id: types.maybeNull(types.number),
  store_id: types.maybeNull(types.number),
  store_name: types.maybeNull(types.string),
  warehouse_name: types.maybeNull(types.string),
  permissions: types.array(Permissions),
});

export const User = types
  .model('User', {
    details: types.maybe(UserInfo),
  })
  .actions((self) => ({
    logIn(user) {
      self.details = user;
      const authToken = {
        Authorization: `Bearer ${user.token}`,
      }
   
    },
    logOut() {
      self.details = undefined;
    },
    has_list_permission(subject) {
     
      const action = `${subject} List`;
      var __FOUND = self?.details?.permissions.find(function (permission, index) {
        if (permission.name == action) return true;
      });
     
      if (__FOUND == undefined) {
        return false;
      } else {
        return true;
      }
    },
    can(act, subject) {
      const action = `${subject} ${act}`;
      var __FOUND = self.details.permissions.find(function (permission, index) {
        if (permission.name == action) return true;
      });
      if (__FOUND == undefined) {
        return false;
      } else {
        return true;
      }
    },
  
  }))
  .views((self) => ({
    get isLoggedIn() {
      return !!self.details;
    },
    get type() {
      if (!self.details) {
        return undefined;
      }
      return self.details.role;
    },
    get auth_token() {
      if (!self.details) {
        return undefined;
      }
      return self.details.token;
    },
    get name() {
      if (!self.details) {
        return undefined;
      }
      return self.details.name;
    },
    get store() {
      if (!self.details) {
        return undefined;
      }
      const store_details={id:self.details.store_id,name:self.details.store_name}
      return store_details;
    },
    get role() {
      if (!self.details) {
        return undefined;
      }
      return self.details.role;
    },
  }));
