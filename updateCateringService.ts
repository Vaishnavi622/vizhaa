import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCateringService() {
  // Fetch existing Catering service
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('name', 'Catering')
    .single();

  if (error) {
    console.error("Error fetching service:", error.message);
    return;
  }

  if (data) {
    let items = data.items || [];
    
    const newItems = [
      { name: "Buffet Service", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop", desc: "Extensive buffet service with multi-cuisine options." },
      { name: "Live Food Counters", img: "https://images.unsplash.com/photo-1601314002592-b8734bca6604?w=400&h=250&fit=crop", desc: "Interactive live food stations for an engaging dining experience." },
      { name: "Sweet & Dessert Counters", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=250&fit=crop", desc: "A wide variety of traditional and modern desserts." },
      { name: "Welcome Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=250&fit=crop", desc: "Refreshing welcome drinks for all guests upon arrival." }
    ];

    let modified = false;
    for (let ni of newItems) {
      if (!items.find((i: any) => i.name === ni.name)) {
        items.push(ni);
        modified = true;
      }
    }

    if (modified) {
      const { error: updateError } = await supabase
        .from('services')
        .update({ items })
        .eq('id', data.id);

      if (updateError) {
        console.error("Error updating service:", updateError.message);
      } else {
        console.log("Successfully added extra options to Catering service.");
      }
    } else {
      console.log("Options already exist in the Catering service.");
    }
  }
}

updateCateringService();
