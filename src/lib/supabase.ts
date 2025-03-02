import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PropertyImage {
  id: string;
  url: string;
  position: number;
  property_id: string;
  created_at: string;
}

export interface PropertyFeature {
  id: string;
  property_id: string;
  feature: string;
  value?: string;
  created_at: string;
}

export interface Property {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  property_type: 'house' | 'apartment' | 'land' | 'commercial';
  status: 'for_sale' | 'for_rent' | 'both';
  total_area: number;
  built_area?: number;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  images: string[];
  property_images?: PropertyImage[];
  property_features?: PropertyFeature[];
  features?: PropertyFeature[];
  featured: boolean;
  address_street: string;
  address_number: string;
  address_complement?: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  latitude?: number;
  longitude?: number;
}

export async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images(*),
      property_features(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  // Transform the data to include images in the expected format
  const propertiesWithFormattedImages = data.map(property => ({
    ...property,
    images: property.property_images?.map((img: PropertyImage) => img.url) || [],
    features: property.property_features || []
  }));

  return propertiesWithFormattedImages as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images(*),
      property_features(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  // Transform the data to include images in the expected format
  const propertyWithFormattedImages = {
    ...data,
    images: data.property_images?.map((img: PropertyImage) => img.url) || [],
    features: data.property_features || []
  };

  return propertyWithFormattedImages as Property;
}

export async function getAvailableCities() {
  const { data, error } = await supabase
    .from('properties')
    .select('address_city')
    .not('address_city', 'is', null);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Remove duplicates and sort
  const cities = [...new Set(data.map(p => p.address_city))].sort();
  return cities;
}