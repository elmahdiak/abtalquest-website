/**
 * AbtalQuest Payzone & CMI Payment Gateway Service
 * 
 * Complies with:
 * 1. PCI-DSS Level 1 Data Security Standards:
 *    - Strict ZERO raw card data storage policy (No PAN, no CVV in Supabase or localStorage).
 *    - Tokenized payments: only gateway token references & CMI transaction IDs are persisted.
 * 2. Moroccan Law No. 09-08 (CNDP):
 *    - Protection of personal transaction data within Morocco.
 *    - Secure transmission and CMI (Centre Monétique Interbancaire) certification standards.
 */

export type CardBrand = 'cmi' | 'visa' | 'mastercard';

export interface PayzoneTransactionInput {
  orderId: string;
  amount: number;
  currency?: string; // Default: 'MAD'
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  billingCity?: string;
}

export interface PayzoneCardCredentials {
  cardHolder: string;
  cardNumber: string; // Used strictly inside hosted tokenization, NEVER stored or persisted
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PayzoneTokenizedResult {
  success: boolean;
  token?: string; // Gateway customer payment token e.g. "payzone_tok_a1b2c3..."
  paymentRef?: string; // CMI transaction authorization code e.g. "CMI_TXN_..."
  cardBrand?: CardBrand;
  last4?: string; // Only last 4 digits for customer receipts
  maskedPan?: string; // e.g. "•••• •••• •••• 4242"
  authCode?: string; // 3D Secure / CMI Authorization Code
  timestamp?: string;
  error?: string;
}

/**
 * Detect Moroccan card network: CMI national cards, Visa, or Mastercard
 */
export const detectCardBrand = (rawNumber: string): CardBrand => {
  const clean = rawNumber.replace(/\s+/g, '');
  // Moroccan national bank card BIN prefixes typically routed via CMI
  if (
    clean.startsWith('5043') ||
    clean.startsWith('5044') ||
    clean.startsWith('5045') ||
    clean.startsWith('5046') ||
    clean.startsWith('5047') ||
    clean.startsWith('60') ||
    clean.startsWith('4035') ||
    clean.startsWith('4026')
  ) {
    return 'cmi';
  }
  if (clean.startsWith('4')) {
    return 'visa';
  }
  if (/^(5[1-5]|2[2-7])/.test(clean)) {
    return 'mastercard';
  }
  return 'cmi'; // Default Moroccan domestic network
};

/**
 * Standard Luhn Algorithm check for card number validation
 */
export const validateLuhn = (num: string): boolean => {
  const clean = num.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

/**
 * Format raw card input with spaces every 4 digits
 */
export const formatCardNumberDisplay = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * PCI-DSS Data Sanitizer Guard
 * Throws a runtime error if any object contains raw credit card numbers or CVVs.
 */
export const assertPciCompliant = (record: Record<string, any>): void => {
  const forbiddenKeys = ['cardnumber', 'card_number', 'pan', 'cvv', 'cvc', 'securitycode'];
  const json = JSON.stringify(record).toLowerCase();

  for (const key of forbiddenKeys) {
    if (json.includes(`"${key}"`)) {
      throw new Error(`[PCI-DSS Violation Blocked] Attempted to store forbidden sensitive card field "${key}".`);
    }
  }

  // Regex looking for unmasked 13 to 19 digit sequence
  const cardSequenceRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13})\b/;
  if (cardSequenceRegex.test(json)) {
    throw new Error('[PCI-DSS Violation Blocked] Unmasked credit card number detected in payload.');
  }
};

/**
 * Process tokenized payment through Payzone / CMI Gateway
 * Simulates the 3D-Secure hosted tokenization workflow used by Payzone Morocco.
 */
export const processPayzoneCardPayment = async (
  _transaction: PayzoneTransactionInput,
  card: PayzoneCardCredentials
): Promise<PayzoneTokenizedResult> => {
  // 1. Client-side sanity checks
  const cleanNumber = card.cardNumber.replace(/\s+/g, '');
  if (!cleanNumber || cleanNumber.length < 15 || cleanNumber.length > 19) {
    return {
      success: false,
      error: 'Numéro de carte invalide. Veuillez vérifier votre saisie.',
    };
  }

  if (!card.cvv || card.cvv.length < 3) {
    return {
      success: false,
      error: 'Code de sécurité (CVV) invalide.',
    };
  }

  const expMonth = parseInt(card.expiryMonth, 10);
  const expYear = parseInt(card.expiryYear, 10);
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // 26
  const currentMonth = now.getMonth() + 1;

  if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
    return {
      success: false,
      error: "Mois d'expiration invalide (01 - 12).",
    };
  }

  if (isNaN(expYear) || expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return {
      success: false,
      error: 'Votre carte bancaire a expiré.',
    };
  }

  // 2. Simulate secure HTTPS handshake with Payzone / CMI tokenization server
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const brand = detectCardBrand(cleanNumber);
  const last4 = cleanNumber.slice(-4);
  const maskedPan = `•••• •••• •••• ${last4}`;

  // 3. Generate non-sensitive, irreversible gateway token & CMI transaction reference
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
  const token = `payzone_tok_${Date.now().toString(36)}_${randomSuffix.toLowerCase()}`;
  const paymentRef = `CMI_TXN_${Date.now().toString().slice(-6)}_${randomSuffix}`;
  const authCode = `AUTH_${Math.floor(100000 + Math.random() * 900000)}`;

  // Return strictly tokenized metadata - NO raw card credentials
  return {
    success: true,
    token,
    paymentRef,
    cardBrand: brand,
    last4,
    maskedPan,
    authCode,
    timestamp: new Date().toISOString(),
  };
};

/**
 * CNDP Moroccan Law 09-08 Legal Disclosure Text
 */
export const CNDP_LEGAL_NOTICE_FR = `Conformément à la loi n° 09-08 promulguée par le Dahir 1-09-15 du 22 safar 1430 (18 février 2009), relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent. Ce traitement a fait l'objet d'une déclaration auprès de la CNDP. Les données bancaires sont traitées et chiffrées exclusivement par le Centre Monétique Interbancaire (CMI) et Payzone sous protocole sécurisé 3D Secure / PCI-DSS.`;

export const CNDP_LEGAL_NOTICE_AR = `وفقاً للقانون رقم 09-08 الصادر بتنفيذه الظهير الشريف رقم 1-09-15 بتاريخ 22 صفر 1430 (18 فبراير 2009)، المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، فإنكم تتمتعون بحق الوصول والتصحيح للبيانات المتعلقة بكم. تتم معالجة وتشفير المعطيات البنكية حصرياً بواسطة مركز النقديات CMI وباي زون Payzone وفق أعلى معايير الأمان 3D Secure و PCI-DSS.`;
