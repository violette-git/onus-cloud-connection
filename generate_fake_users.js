import { faker } from '@faker-js/faker';

function generateFakeUser() {
  const email = faker.internet.email();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  const username = faker.internet.username();
  const role = 'admin'; // Highest privileges
  const bio = faker.lorem.sentence(5);
  const avatarUrl = faker.image.avatar();
  const location = faker.location.city();
  const website = faker.internet.url();
  const isEmailVerified = true; // No email verification needed

  return {
    id: faker.string.uuid(),
    email,
    name,
    firstName,
    lastName,
    username,
    role,
    bio,
    avatarUrl,
    location,
    website,
    full_name: name,
    isEmailVerified,
  };
}

function generateFakeUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateFakeUser());
  }
  return users;
}

function generateInsertStatements(users) {
  const insertStatements = users.map(user => {
    const { id, email, name, username, role, bio, avatarUrl, location, website, full_name, firstName, lastName, isEmailVerified } = user;
    return `INSERT INTO profiles (id, email, name, username, role, bio, avatar_url, location, website, full_name, first_name, last_name, is_email_verified) VALUES ('${id}', '${email}', '${name}', '${username}', '${role}', '${bio}', '${avatarUrl}', '${location}', '${website}', '${full_name}', '${firstName}', '${lastName}', ${isEmailVerified});`;
  });
  return insertStatements.join('\n');
}

const fakeUsers = generateFakeUsers(100);
const insertStatements = generateInsertStatements(fakeUsers);

console.log(insertStatements);
