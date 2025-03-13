import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to generate a fake user profile
const generateFakeUserProfile = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
const username = faker.internet.username({ firstName, lastName });
  const bio = faker.lorem.sentence();
  const avatarUrl = faker.image.avatar();
  const location = faker.location.city();
  const website = faker.internet.url();

  return {
    first_name: firstName,
    last_name: lastName,
    email,
    username,
    bio,
    avatar_url: avatarUrl,
    location,
    website,
  };
};

// Function to insert fake user profiles into the database
const insertFakeProfiles = async (count) => {
  for (let i = 0; i < count; i++) {
    const fakeProfile = generateFakeUserProfile();
const { data, error } = await supabase.from('profiles').insert([fakeProfile]);

if (error) {
  console.error(`Error inserting profile ${i + 1}:`, error);
} else if (data) {
  console.log(`Inserted profile ${i + 1}:`, data);
} else {
  console.log(`Inserted profile ${i + 1}: No data returned`);
}
  }
};

// Insert 50 fake user profiles
insertFakeProfiles(50);
