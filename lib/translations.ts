import { cookies } from 'next/headers';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

type Messages = typeof esMessages;

export async function getTranslations(namespace: string) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';
  
  const messages: Messages = locale === 'es' ? esMessages : enMessages;
  
  // Navegar al namespace específico
  const namespaceMessages = (messages as any)[namespace] || {};
  
  return (key: string) => {
    return namespaceMessages[key] || key;
  };
}
