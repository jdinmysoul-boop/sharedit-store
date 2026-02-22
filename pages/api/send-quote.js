import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { company, name, email, phone, consultation, message, items, summary } = req.body;

  // [개발용 임시 로그] 실제 메일 서버 설정 전에는 터미널에 정보를 출력합니다.
  console.log("=== 견적 요청 수신 ===");
  console.log(`회사: ${company}, 담당자: ${name}`);
  console.log(`이메일: ${email}, 연락처: ${phone}`);
  console.log(`상담요청: ${consultation}`);
  console.log(`총액: ${summary.grandTotal}`);
  console.log("======================");

  // [실제 메일 발송 로직] 
  // Vercel 배포 후 환경변수(SMTP_USER, SMTP_PASS)를 설정하면 작동합니다.
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const itemsHtml = items.map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}개</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.price * item.quantity).toLocaleString()}원</td>
        </tr>
      `).join('');

      const htmlContent = `
        <h2>[Shared IT] 견적 요청이 접수되었습니다.</h2>
        <p>안녕하세요, ${company} ${name}님.</p>
        <p>요청하신 광고 상품 견적 내역입니다.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f7; text-align: left;">
              <th style="padding: 8px;">상품명</th>
              <th style="padding: 8px;">수량</th>
              <th style="padding: 8px;">금액</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p><strong>총 합계 (VAT포함): ${summary.grandTotal.toLocaleString()}원</strong></p>
        <br/>
        ${consultation ? '<p style="color: #09afdf; font-weight: bold;">[상담 요청] 담당자와의 미팅을 희망하셨습니다. 곧 연락드리겠습니다.</p>' : ''}
      `;

      // 관리자에게
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'admin@sharedit.com', // 실제 관리자 이메일로 변경하세요
        subject: `[Lead] ${company} 견적 요청 (상담: ${consultation ? 'O' : 'X'})`,
        html: htmlContent + `<br/><p>연락처: ${phone}</p><p>메모: ${message}</p>`
      });

      // 고객에게
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: '[Shared IT] 요청하신 광고 상품 견적서입니다.',
        html: htmlContent
      });

    } catch (error) {
      console.error('Mail Error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  res.status(200).json({ success: true });
}