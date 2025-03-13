import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fetchMusicians = async () => {
  const { data, error } = await supabase
    .from('musicians')
    .select('id, stage_name');

  if (error) {
    console.error('Error fetching musicians:', error.message);
  } else {
    data.forEach((musician) => {
      console.log(`Musician ID: ${musician.id}, Stage Name: ${musician.stage_name}`);
    });
  }
};

fetchMusicians();
