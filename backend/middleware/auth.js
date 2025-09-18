const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

module.exports = async function auth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return next()
    const { data, error } = await supabase.auth.getUser(token)
    if (!error && data?.user) req.user = data.user
  } catch (e) {
    // opcional: log
  } finally {
    next()
  }
}