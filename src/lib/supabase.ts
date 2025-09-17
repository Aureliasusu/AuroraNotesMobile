import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// 这些是您的Supabase项目配置
// 与AuroraNotes Web项目共享同一个Supabase数据库
const supabaseUrl = 'https://xnxvcofyvhifecmxeruk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHZjb2Z5dmhpZmVjbXhlcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDA2ODQsImV4cCI6MjA3MjI3NjY4NH0.GSwPnbroXL1Z1fSCh-ObDl5CZZe4ZIp9eOXPA_svL5Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 启用自动刷新token
    autoRefreshToken: true,
    // 持久化session
    persistSession: true,
    // 检测URL变化
    detectSessionInUrl: false,
  },
});
