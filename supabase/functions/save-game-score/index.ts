// Fonction Edge Supabase pour sauvegarder les scores de manière sécurisée
// Cette fonction contourne RLS en utilisant le service_role_key côté serveur

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Créer un client Supabase avec service_role (bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { 
      email, 
      pseudo, 
      score, 
      niveau_atteint, 
      temps_jeu,
      donnees_extra,
      ville,
      pays,
      age,
      genre,
      avatar 
    } = await req.json()

    // Validation des données requises
    if (!email || !pseudo || score === undefined) {
      return new Response(
        JSON.stringify({ error: 'Email, pseudo et score sont requis' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email invalide' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // 1. Vérifier si l'utilisateur existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    let userId

    if (existingUser) {
      // Utilisateur existe, mettre à jour si nécessaire
      userId = existingUser.id
      
      // Mettre à jour le pseudo/avatar si fourni
      if (pseudo !== existingUser.pseudo || avatar) {
        await supabaseAdmin
          .from('users')
          .update({ 
            pseudo: pseudo,
            avatar: avatar || existingUser.avatar,
            ville: ville || existingUser.ville,
            pays: pays || existingUser.pays,
            age: age || existingUser.age,
            genre: genre || existingUser.genre
          })
          .eq('id', userId)
      }
    } else {
      // Créer un nouvel utilisateur
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert([{
          email: email,
          pseudo: pseudo,
          avatar: avatar || null,
          ville: ville || null,
          pays: pays || null,
          age: age || null,
          genre: genre || null
        }])
        .select()
        .single()

      if (createError) {
        console.error('Erreur création utilisateur:', createError)
        return new Response(
          JSON.stringify({ error: 'Erreur création utilisateur', details: createError.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        )
      }

      userId = newUser.id
    }

    // 2. Récupérer l'ID du jeu "Petit Bateau Rouge"
    const { data: game } = await supabaseAdmin
      .from('games')
      .select('id')
      .eq('nom', 'Petit Bateau Rouge')
      .single()

    if (!game) {
      return new Response(
        JSON.stringify({ error: 'Jeu non trouvé dans la base de données' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      )
    }

    // 3. Insérer le score
    const { data: scoreData, error: scoreError } = await supabaseAdmin
      .from('scores')
      .insert([{
        user_id: userId,
        game_id: game.id,
        score: score,
        niveau_atteint: niveau_atteint || null,
        temps_jeu: temps_jeu || null,
        donnees_extra: donnees_extra || null
      }])
      .select()
      .single()

    if (scoreError) {
      console.error('Erreur insertion score:', scoreError)
      return new Response(
        JSON.stringify({ error: 'Erreur sauvegarde score', details: scoreError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    // Succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: userId,
        score_id: scoreData.id,
        message: 'Score enregistré avec succès'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
