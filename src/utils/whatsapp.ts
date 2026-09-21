export type WhatsAppPosition = 'bottom-right' | 'bottom-left';

export const WHATSAPP_POSITION_STORAGE_KEY = 'abtalquest_whatsapp_position';
export const WHATSAPP_POSITION_EVENT = 'abtalquest_whatsapp_position_changed';

export function getStoredWhatsAppPosition(): WhatsAppPosition {
  if (typeof window === 'undefined') return 'bottom-left';
  try {
    const saved = localStorage.getItem(WHATSAPP_POSITION_STORAGE_KEY);
    if (saved === 'bottom-left' || saved === 'bottom-right') {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read WhatsApp position from localStorage:', e);
  }
  return 'bottom-left';
}

export function setStoredWhatsAppPosition(pos: WhatsAppPosition): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WHATSAPP_POSITION_STORAGE_KEY, pos);
    window.dispatchEvent(new CustomEvent(WHATSAPP_POSITION_EVENT, { detail: pos }));
  } catch (e) {
    console.warn('Failed to save WhatsApp position to localStorage:', e);
  }
}
