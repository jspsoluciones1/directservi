import { createClient } from '@supabase/supabase-js';

/**
 * Crea un cliente de Supabase para el entorno Node.js/Express
 */
export const createSupabaseClient = (req, res) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage: {
          getItem: (key) => {
            return req.cookies[key] || null;
          },
          setItem: (key, value) => {
            res.cookie(key, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
            });
          },
          removeItem: (key) => {
            res.clearCookie(key);
          }
        }
      }
    }
  );
};

/**
 * Obtiene el perfil completo de un usuario
 */
export async function getUserProfile(supabase, userId) {
  try {
    // Paso 1: Obtener el perfil base y el rol
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, role:roles(name)')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }
    
    if (!profile) return null;

    // Aplanar el rol para fácil acceso
    const userProfile = {
        ...profile,
        role_name: profile.role ? profile.role.name : null,
        business: null
    };

    // Paso 2: Si el usuario tiene un business_id, obtener los datos de ese negocio
    if (profile.business_id) {
      const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('*, style:business_styles(*)')
          .eq('id', profile.business_id)
          .single();
      
      if (businessError) {
          console.error(`Error fetching business details:`, businessError);
          return userProfile;
      }

      userProfile.business = business;
    }
    
    return userProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

// Servicios de datos
export async function getCompanies(supabase) {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) console.error('Error fetching companies:', error);
    return data || [];
}

export async function getBusinesses(supabase) {
    const { data, error } = await supabase
        .from('businesses')
        .select('*, company:companies(name)');
    if (error) console.error('Error fetching businesses:', error);
    return data || [];
}

export async function getUsersByBusiness(supabase, businessId) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*, role:roles(name)')
        .eq('business_id', businessId);

    if (error) {
        console.error('Error fetching users by business:', error);
        return [];
    }
    return data;
}

export async function getProviders(supabase) {
    const { data, error } = await supabase.from('providers').select('*');
    if (error) console.error('Error fetching providers:', error);
    return data || [];
}

export async function getRatesByBusiness(supabase, businessId) {
    const { data, error } = await supabase
        .from('rates')
        .select('*, provider:providers(name, logo_url)')
        .eq('business_id', businessId)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching rates by business:', error);
        return [];
    }
    return data;
}

export async function getProposalsByUser(supabase, userId) {
    const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('created_by_user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching proposals by user:', error);
        return [];
    }
    return data;
}

export async function getRoles(supabase) {
    const { data, error } = await supabase.from('roles').select('*');
    if (error) console.error('Error fetching roles:', error);
    return data || [];
}