export const DISCOUNT_RULES = {
  "E-1": { 3: 0.15, 5: 0.20 }, // eDM 발송
  "W-1": { 3: 0.15, 5: 0.20 }  // 웨비나 패키지
};

export function calculateItemTotal(item) {
  const { id, price, quantity } = item;
  let finalPrice = price * quantity;
  let discountRate = 0;

  // 할인 대상 상품인지 확인
  if (DISCOUNT_RULES[id]) {
    if (quantity >= 5) {
      discountRate = DISCOUNT_RULES[id][5]; // 20%
    } else if (quantity >= 3) {
      discountRate = DISCOUNT_RULES[id][3]; // 15%
    }
  }

  const discountAmount = finalPrice * discountRate;
  const total = finalPrice - discountAmount;

  return {
    subtotal: finalPrice,   // 정가 합계
    discount: discountAmount, // 할인 금액
    total: total,           // 최종 공급가액
    discountRate: discountRate // 표시용 할인율 (예: 0.2)
  };
}

export function calculateCartSummary(items) {
  let subtotal = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const calc = calculateItemTotal(item);
    subtotal += calc.subtotal;
    totalDiscount += calc.discount;
  });

  const finalTotal = subtotal - totalDiscount;
  const vat = finalTotal * 0.1;

  return {
    subtotal,         // 총 정가
    totalDiscount,    // 총 할인액
    supplyPrice: finalTotal, // 공급가액 (VAT 전)
    vat,              // 부가세
    grandTotal: finalTotal + vat // 최종 결제 금액
  };
}