/**
 * AbtalQuest Payment & Data Protection Compliance Service
 * 
 * Complies with:
 * 1. Strict Zero-Card Policy (PCI-DSS):
 *    - All physical orders are handled strictly via Cash on Delivery (COD).
 *    - Strict ZERO raw card data storage policy (No PAN, no CVV in Supabase or localStorage).
 * 2. Moroccan Law No. 09-08 (CNDP):
 *    - Protection of personal order and shipping data within Morocco.
 */

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
 * CNDP Moroccan Law 09-08 Legal Disclosure Text for Cash on Delivery (COD) Orders
 */
export const CNDP_LEGAL_NOTICE_FR = `Conformément à la loi n° 09-08 promulguée par le Dahir 1-09-15 du 22 safar 1430 (18 février 2009), relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent. Ce traitement a fait l'objet d'une déclaration auprès de la CNDP. Les informations recueillies sont exclusivement destinées au traitement, à la préparation et à la livraison de vos colis avec paiement à la livraison (Cash on Delivery). Aucune donnée bancaire n'est demandée ni enregistrée sur nos serveurs.`;

export const CNDP_LEGAL_NOTICE_AR = `وفقاً للقانون رقم 09-08 الصادر بتنفيذه الظهير الشريف رقم 1-09-15 بتاريخ 22 صفر 1430 (18 فبراير 2009)، المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، فإنكم تتمتعون بحق الوصول والتصحيح للبيانات المتعلقة بكم. هذا الإجراء مصرح به لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP). تُستخدم المعلومات المجمعة حصرياً لمعالجة وإيصال طلباتكم مع الدفع نقداً عند الاستلام (Cash on Delivery). لا يتم طلب أو حفظ أي بيانات بنكية في خوادمنا.`;
