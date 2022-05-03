import mongoose from 'mongoose';
import { Role, User } from '../models/';
import config from '../config';

const action = process.env.ACTION || 'create';
const password = '$2a$10$8.JrNagw6.JibSHK.E4eBe8Kyr9oR58T.grQ49SBmc9vVNs2OzYfu'; // 123456

const ROLES = [
  { name: 'Administrator', value: 'admin' },
  { name: 'Moderator', value: 'moderator' },
  { name: 'User', value: 'user' },
];

const create = async (Model, data) => {
  try {
    const count = await Model.estimatedDocumentCount();
    if (count > 0) return;

    const values = await Promise.all(data.map(i => new Model(i).save()));
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

const remove = async () => {
  await Role.remove();
  await User.remove();
};

async function start() {
  try {
    await mongoose.connect(config.mongodb.url, config.mongodb.options);

    if (action === 'create') {
      await create(Role, ROLES);
      const roles = await Role.find();
      const USERS = roles.map(role => ({ name: role.name, email: `${role.value}@test.com`, password, roles: [role._id] }));
      await create(User, USERS);
    }
    if (action === 'remove') {
      await remove();
    }
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
}

start();
