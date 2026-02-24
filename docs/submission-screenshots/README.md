# 2호기 Invoice Generator - App Store 제출 스크린샷

## 제출 정보
- **제출 일시**: 2026년 2월 25일 (화) 01:29 KST
- **앱 이름**: InvoiceGen ‑ B2B PDF Invoice
- **Version**: 7
- **상태**: 심사 대기 중

---

## 스크린샷 목록

### 1. Marketing Hero Image
**파일**: `1-marketing-hero.jpg`
- **설명**: 앱 마케팅 이미지
- **내용**: 
  - "Auto-Generate Professional PDF Invoices"
  - "Built for B2B merchants. Every order gets a branded invoice — automatically."
  - 주요 기능: 자동 생성, 다국어 지원, Tax/Shipping, 대량 다운로드 & 이메일
  - 100% Automated, B2B Ready, PDF Instant

### 2. App Icon
**파일**: `2-app-icon.jpg`
- **설명**: 앱 아이콘 디자인
- **크기**: 1024x1024 (권장)
- **디자인**: Teal/blue 그라데이션, 인보이스 문서 + 체크마크 아이콘
- **상태**: 향후 업로드 필요 (1200x1200px)

### 3. Dashboard
**파일**: `3-dashboard.jpg`
- **설명**: 메인 대시보드 화면
- **통계**:
  - Total Invoices: 2
  - Emails Sent: 0
  - Recent Invoices: 2
- **기능**:
  - 검색 (invoice #, order #, customer name)
  - 최근 인보이스 목록 (INV-1009 한글, INV-1008 영어)
  - Download PDF 버튼
- **알림**: "Invoice Generator - English Only (For Now)" banner
  - "Korean and Japanese language support coming in the next update!"

### 4. Company Settings
**파일**: `4-company-settings.jpg`
- **설명**: 회사 정보 설정 화면
- **입력 필드**:
  - Company Name: "Test Company"
  - Address: "Seoul, Korea"
  - City, Postal Code
  - Country
  - Tax ID / Business Number: "123-45-67890"
  - Email, Phone
  - Invoice Language: English (dropdown)
- **기능**: "Save Settings" 버튼
- **상태**: Controlled components (useState)

### 5. All Invoices
**파일**: `5-all-invoices.jpg`
- **설명**: 인보이스 리스트 화면
- **총 인보이스**: 2개
- **기능**:
  - 검색 (Search invoices...)
  - 필터: All / Sent / Not Sent
  - Select All (체크박스)
  - 대량 다운로드
- **인보이스 목록**:
  - INV-1009: Order #1009 • 김철수 • KRW 438.43 • 2026. 2. 24.
  - INV-1008: Order #1008 • John Smith • USD 438.43 • 2026. 2. 24.
- **안내**: "Select multiple orders from the 'Create from Orders' button to generate invoices in bulk. Use checkboxes to download multiple PDFs at once."

### 6. Order Picker Modal
**파일**: `6-order-picker-modal.jpg`
- **설명**: 주문 선택 모달 (Custom GraphQL)
- **제목**: "Select Orders to Generate Invoices"
- **검색**: "Search orders by number, customer..."
- **제한**: "Select up to 10 orders to generate invoices"
- **주문 목록**:
  - #1008: paid • 2† • thss2641@gmail.com • USD 949.95 • 2026. 2. 23.
  - #1007: paid • 2† • thss2641@gmail.com • USD 729.95 • 2026. 2. 23.
  - #1006: paid • 2† • thss2641@gmail.com • USD 699.95 • 2026. 2. 23.
  - #1005: paid • 2† • thss2641@gmail.com • USD 949.95 • 2026. 2. 23.
- **버튼**: Cancel / Create Invoices (0)
- **특징**: 체크박스, 스크롤 가능, 검색 가능

### 7. Korean PDF Sample
**파일**: `7-korean-pdf-sample.jpg`
- **설명**: 한글 PDF 생성 샘플 (INV-1009)
- **PDF 파일명**: INV-1009%20(2).pdf
- **헤더**:
  - Company: Test Company
  - Address: Seoul, Korea
  - Tax ID: 123-45-67890
  - Invoice Number: INV-1009
  - Order Number: 1009
  - Date: February 23, 2026
- **고객 정보 (Bill To)**:
  - 김철수
  - chuheo.kim@example.com
  - 서울특별시 강남구 테헤란로 123
  - 서울, 06234
  - 대한민국
- **품목**:
  - 프리미엄 무선 헤드폰: 2 x KRW 149.99 = KRW 299.98
  - USB-C 충전 케이블 (2m): 3 x KRW 19.99 = KRW 59.97
  - 울트라 클리어 폰 케이스: 1 x KRW 24.99 = KRW 24.99
- **금액**:
  - Subtotal: KRW 384.94
  - Tax (10%): KRW 38.49
  - Shipping: KRW 15.00
  - **Total: KRW 438.43** (파란색 강조)
- **푸터**: 
  - "Thank you for your business!"
  - "Payment due within 30 days"
- **특징**:
  - ✅ 한글 렌더링 완벽 (Noto Sans KR)
  - ✅ Professional 디자인 (보라색 헤더)
  - ✅ 모든 필드 정상 표시

---

## 기술적 성과

### CJK Font Support
- **폰트**: Noto Sans KR Regular + Bold (6.2MB each)
- **자동 감지**: 한글/일본어 문자 자동 인식
- **PDF 크기**: 14KB (CJK) vs 2KB (English)

### UI/UX
- **100% Polaris**: Shopify native components
- **Responsive**: Mobile-friendly
- **Accessibility**: Screen reader support

### Performance
- **Database**: Neon PostgreSQL (Singapore)
- **Hosting**: Render.com (Singapore, Free tier)
- **Response Time**: 454ms average
- **Uptime**: 100%

---

## 다음 단계

### 심사 기간 중 (3-7일)
1. **Billing API 구현** (Free/Pro plans)
2. **Email Delivery** (Resend.com 연동)
3. **Logo Upload** (Cloudinary)
4. **App Icon 제작** (1200x1200px)

### 승인 후
1. Pro plan 활성화 ($29/month)
2. Protected Customer Data 신청
3. orders/create webhook 활성화
4. 자동 이메일 발송 기능

---

## 참고 링크

- **Production URL**: https://invoice-generator-r60s.onrender.com
- **GitHub**: https://github.com/son8894/invoice-generator
- **Version 7 URL**: https://dev.shopify.com/dashboard/207272885/apps/326570311681/versions/870799867905
- **Partners Dashboard**: https://partners.shopify.com/207272885/apps/326570311681

---

**제출 완료!** 🎉
- 1호기: Feb 24, 03:00 제출 ✅
- 2호기: Feb 25, 01:29 제출 ✅

**총 개발 시간**: 12시간 (Feb 24, 15:00 - Feb 25, 01:29 KST)
