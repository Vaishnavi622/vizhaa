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

async function updateDecorationService() {
  // Fetch existing Decoration service
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('name', 'Decoration')
    .single();

  if (error) {
    console.error("Error fetching service:", error.message);
    return;
  }

  if (data) {
    let items = data.items || [];
    
    const newItems = [
      { name: "Balloon Decoration", desc: "Vibrant balloon designs", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop" },
      { name: "Entrance Decoration", desc: "Grand entrance setups", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&h=300&fit=crop" },
      { name: "Mandap Decoration", desc: "Traditional mandap designs", img: "https://images.unsplash.com/photo-1751257567128-a90534b263e6?w=500&h=300&fit=crop" },
      { name: "LED Decoration", desc: "Modern LED lighting setups", img: "https://images.unsplash.com/photo-1769812344099-8e52466aea8e?w=500&h=300&fit=crop" },
      { name: "Table Decoration", desc: "Elegant table settings", img: "https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?w=500&h=300&fit=crop" }
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
        console.log("Successfully added extra options to Decoration service.");
      }
    } else {
      console.log("Options already exist in the Decoration service.");
    }
  }
}

updateDecorationService();
