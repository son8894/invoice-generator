# Deployment Checklist - Invoice Generator

## 📋 Pre-Deployment (완료됨)

### ✅ Code Complete
- [x] Polaris UI 구현
- [x] Dashboard (통계, 최근 인보이스)
- [x] Order Picker (Custom Modal)
- [x] Invoices 리스트 (검색, 필터, 일괄 다운로드)
- [x] Settings (회사 정보 저장)
- [x] PDF 생성 (프로페셔널 디자인)
- [x] Navigation (onAction 방식)
- [x] 영어 전용 버전 (한글/일본어는 다음 업데이트)

### ✅ Git & Render
- [x] Git repository: https://github.com/son8894/invoice-generator
- [x] Render service: invoice-generator-r60s.onrender.com
- [x] Auto-deploy from main branch
- [x] Environment variables 설정
- [x] Database: Neon PostgreSQL (Singapore)

---

## 📸 App Store 제출 - 필수 스크린샷 (5장)

### 사용자가 직접 촬영해야 함:

#### 1. Dashboard
```
경로: Shopify Admin → Apps → ctrl+ainvoice-generator
화면: 메인 Dashboard
- 통계 카드 (Total Invoices, Emails Sent, Recent Invoices)
- "Invoice Generator - English Only" 배너
- Recent Invoices 리스트
- Create from Orders 버튼
```

#### 2. Order Picker Modal
```
경로: Dashboard → "Create from Orders" 버튼 클릭
화면: Select Orders Modal
- 주문 목록 (체크박스)
- Search 바
- "Create Invoices (3)" 버튼
- Paid 배지
```

#### 3. Settings
```
경로: Dashboard → Settings 버튼
화면: Company Settings
- Company Name 입력란
- Address, City, Postal Code 등
- Invoice Language (English)
- Save Settings 버튼
```

#### 4. Invoices 리스트
```
경로: Dashboard → View All Invoices
화면: All Invoices
- Search 바
- Filter 버튼 (All/Sent/Not Sent)
- Invoice 리스트 (INV-1008 등)
- Download 버튼
```

#### 5. PDF 샘플
```
경로: Dashboard → Download PDF 버튼 클릭
화면: 생성된 PDF 파일
- 보라색 헤더
- 회사 정보
- 상품 리스트
- Subtotal, Tax, Shipping, Total
- 푸터 (Thank you message)
```

---

## 🚀 Shopify App Store 제출

### App Information

**App Name**: InvoiceGen ‑ B2B PDF Invoice

**Tagline**: Professional PDF invoices with automatic generation for B2B merchants

**Category**: 
- Primary: Invoicing and receipts
- Secondary: B2B

**Pricing**:
```json
{
  "plans": [
    {
      "name": "Free",
      "price": "$0/month",
      "features": [
        "Up to 50 invoices per month",
        "Professional PDF templates",
        "Company branding (text only)",
        "Manual download"
      ]
    },
    {
      "name": "Pro (Coming Soon)",
      "price": "$29/month",
      "features": [
        "Unlimited invoices",
        "Logo upload",
        "Automatic email delivery",
        "Priority support"
      ]
    }
  ]
}
```

**Support Email**: thss2641@gmail.com

**Privacy Policy URL**: https://invoice-generator-r60s.onrender.com/privacy

**App URL**: https://invoice-generator-r60s.onrender.com

---

## 📝 App Listing Text

### Short Description (70자)
```
Professional PDF invoices for B2B - Auto-generate beautiful invoices
```

### Full Description
(docs/APP_STORE_LISTING.md 참조)

---

## ✅ Deployment Steps

### 1. Render 배포 확인
- [ ] https://invoice-generator-r60s.onrender.com 접속 확인
- [ ] /privacy 페이지 정상 작동 확인

### 2. Shopify Dev Store 테스트
- [ ] Settings 저장:
  - Company Name: Test Company
  - Address: 123 Business Street
  - City: Seoul
  - Country: South Korea
  - Tax ID: 123-45-67890
  - Email: hello@testcompany.com
  - Invoice Language: English
- [ ] Order Picker 작동 확인
- [ ] PDF 다운로드 테스트
- [ ] 모든 기능 정상 작동 확인

### 3. 스크린샷 촬영
- [ ] 5장 스크린샷 촬영 (위 목록 참조)
- [ ] 이미지 크기: 1280x800 이상 권장
- [ ] PNG 또는 JPG 형식

### 4. Shopify Partners 제출
```
1. https://partners.shopify.com/organizations 접속
2. Apps → ctrl+ainvoice-generator → Distribution
3. "Start app submission" 클릭
4. 앱 정보 입력
5. 스크린샷 5장 업로드
6. Submit for Review 클릭
```

---

## 🔄 Post-Submission (심사 대기 중)

### Next Update (1-2주 내)

**Phase 1: Billing API** (3-5일)
- [ ] Shopify Billing API 연동
- [ ] Free/Pro 요금제 페이지
- [ ] 결제 flow
- [ ] 구독 상태 확인

**Phase 2: Email Delivery** (3-5일)
- [ ] Resend.com 계정 생성
- [ ] orders/create 웹훅 재활성화
- [ ] PDF 첨부 이메일 발송
- [ ] Email template 디자인

**Phase 3: Logo Upload** (2-3일)
- [ ] 파일 업로드 UI
- [ ] Cloudinary 또는 Shopify Files 연동
- [ ] PDF에 로고 표시

**Phase 4: Korean/Japanese Fonts** (1일)
- [ ] Noto Sans KR/JP 폰트 추가
- [ ] 다국어 PDF 테스트
- [ ] Settings 언어 옵션 활성화

---

## 📊 Success Metrics

### Week 1-2
- [ ] App Store 승인
- [ ] 첫 10 설치
- [ ] 첫 리뷰 받기

### Month 1
- [ ] 50 설치 (Built for Shopify 기준)
- [ ] 5 리뷰 (평점 4.0+)
- [ ] Pro 요금제 출시

### Month 2-3
- [ ] 첫 유료 고객 (Pro $29)
- [ ] 100 설치
- [ ] Built for Shopify 뱃지 신청

### Month 4-6
- [ ] 월 $1,000 수익 (35 유료 고객)
- [ ] 500 설치
- [ ] 한국/일본 시장 진출

---

## 🎯 현재 상태

**Date**: 2026-02-24
**Status**: Ready for App Store Submission
**Blockers**: 
- 스크린샷 5장 필요 (사용자가 직접 촬영)
- Settings 저장 필요

**Next Action**: 
1. Settings 저장
2. 스크린샷 촬영
3. Shopify Partners에서 제출

---

## 📞 Contact

- GitHub: https://github.com/son8894/invoice-generator
- Email: thss2641@gmail.com
- Shopify Partners: thss2641@gmail.com
