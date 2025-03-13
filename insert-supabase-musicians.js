import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateFakeMusicianProfile = () => ({
  stage_name: faker.person.fullName(),
  genre: faker.music.genre(),
  instruments: Array.from({ length: 3 }, () => faker.music.genre()),
  bio: faker.lorem.paragraph(),
  avatar_url: faker.image.avatar(),
  location: `${faker.location.city()}, ${faker.location.state()}`,
  website: faker.internet.url()
});

const insertFakeMusicians = async (count) => {
  for (let i = 0; i < count; i++) {
const response = await supabase
  .from('musicians')
  .insert([generateFakeMusicianProfile()]);

if (response.error) {
  console.error(`Error inserting musician ${i + 1}:`, response.error);
} else {
  const musicianId = response.data?.[0]?.id;
  console.log(`Inserted musician ${i + 1}: ${musicianId ? musicianId : 'Failed to retrieve ID'}`);
}
  }
};

// Insert 50 fake musician profiles
insertFakeMusicians(50);
