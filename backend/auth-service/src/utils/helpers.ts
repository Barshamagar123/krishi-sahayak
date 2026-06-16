export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function validatePhoneNumber(phone: string): boolean {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check: starts with 98, 97, or 96 AND has exactly 10 digits
  if (cleaned.length !== 10) return false;
  if (!cleaned.startsWith('98') && !cleaned.startsWith('97') && !cleaned.startsWith('96')) return false;
  
  return true;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && (cleaned.startsWith('98') || cleaned.startsWith('97') || cleaned.startsWith('96'))) {
    return cleaned;
  }
  return phone;
}

export function getNepalTime(): Date {
  const now = new Date();
  const nepalOffset = 5.75 * 60 * 60 * 1000;
  return new Date(now.getTime() + nepalOffset);
}
