// supabase-config.js
const { createClient } = require('@supabase/supabase-js');
// Do this only in a secure environment


const supabaseUrl = 'https://kyexsedeudmtmwtrxlyc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase };
