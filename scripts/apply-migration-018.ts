import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('🚀 Aplicando migración 018: Membership Monthly Logic...')
  
  // Leer el archivo de migración
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '018_membership_monthly_logic.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
  
  try {
    // Ejecutar la migración
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    })
    
    if (error) {
      // Si la función exec_sql no existe, usar el método directo
      console.log('⚠️  Función exec_sql no encontrada, aplicando SQL directamente...')
      
      // Dividir por punto y coma y ejecutar cada statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.length > 0) {
          const { error: execError } = await supabase.rpc('exec', {
            sql: statement
          })
          
          if (execError) {
            console.error('❌ Error ejecutando statement:', execError)
            throw execError
          }
        }
      }
    }
    
    console.log('✅ Migración 018 aplicada exitosamente!')
    console.log('📊 Verificando estado de usuarios...')
    
    // Verificar cuántos usuarios tienen membresía activa
    const { data: activeUsers, error: queryError } = await supabase
      .from('user_profiles')
      .select('id, is_active, first_name, last_name')
      .eq('is_active', true)
    
    if (queryError) {
      console.error('⚠️  Error verificando usuarios:', queryError)
    } else {
      console.log(`✅ Usuarios con membresía activa: ${activeUsers?.length || 0}`)
    }
    
  } catch (error) {
    console.error('❌ Error aplicando migración:', error)
    throw error
  }
}

applyMigration()
  .then(() => {
    console.log('🎉 Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
