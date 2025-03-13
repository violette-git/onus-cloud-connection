import { supabase } from '@/integrations/supabase/client';

async function testQuery() {
  const { data, error } = await supabase
    .from('followers')
    .select('followee_id, followee(*)')
    .eq('follower_id', 'some_user_id');

  console.log('Data:', data);
  console.log('Error:', error);
}

testQuery();