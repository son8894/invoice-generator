# 🚀 Invoice Generator - App Store 제출 최종 체크리스트

**Date**: Feb 24-25, 2026  
**Status**: ✅ Ready for Submission

---

## ✅ 1. 개발 완료 (100%)

### Core Features
- [x] Dashboard with statistics (Total Invoices, Emails Sent, Recent Invoices)
- [x] Order Picker Modal (Custom GraphQL-based, max 10 orders)
- [x] Invoices List (Search, Filter: All/Sent/Not Sent, Bulk download)
- [x] Settings (Company info: 8 fields, controlled components)
- [x] PDF Generation (Professional design, colored header, tax/shipping)
- [x] **CJK Font Support** (Noto Sans KR/JP Regular + Bold, auto-detection)
- [x] Polaris UI (100% Shopify native components)

### Technical Infrastructure
- [x] Neon PostgreSQL (Singapore region)
- [x] Prisma ORM + 4 migrations
- [x] Shopify App Bridge v4 (session token auth)
- [x] GraphQL API for orders (no REST dependency)
- [x] Privacy Policy page (/privacy)

---

## ✅ 2. 배포 완료

### Git Repository
- [x] Repository: son8894/invoice-generator
- [x] Commits: 20+ commits
- [x] Latest commits:
  - 67c615d: feat: Add Korean/Japanese font support
  - e228ef8: docs: Add App Store screenshots (5 images)
  - 1ae71e3: fix: Convert Settings form to controlled components

### Render.com Deployment
- [x] URL: https://invoice-generator-r60s.onrender.com
- [x] Region: Singapore (Free tier)
- [x] Auto-deploy: Enabled (on git push)
- [x] Status: ⏳ Deployment in progress (ETA: 5 min)

---

## ✅ 3. App Store 제출 준비

### Screenshots (5장, 214KB total)
- [x] 1-dashboard.jpg (44KB) - Statistics + Recent Invoices
- [x] 2-settings-complete.jpg (41KB) - Company info fully filled
- [x] 3-invoices-list.jpg (32KB) - Search + Filter UI
- [x] 4-order-picker-modal.jpg (42KB) - Order selection modal
- [x] 5-pdf-korean.jpg (55KB) - **Korean PDF sample (INV-1009)**

### App Store Listing Content
- [x] APP_STORE_LISTING.md (5,566 bytes)
  - App Name: Invoice Generator
  - Tagline: "Professional PDF invoices in one click"
  - Description: 2,000 characters
  - Features: 6 key features
  - Use Cases: 3 scenarios
  - Pricing: Free + Pro ($29/month)
  - Support: support@testcompany.kr

### Company Settings (Test Data)
- [x] Company Name: Test Company
- [x] Address: Seoul, Korea
- [x] City: Seoul
- [x] Postal Code: 06234
- [x] Country: South Korea
- [x] Tax ID: 123-45-67890
- [x] Email: support@testcompany.kr
- [x] Phone: +82-2-1234-5678

---

## ✅ 4. 최종 테스트 (Production)

### Before Submission
- [ ] Render deployment status: **Live** ✅
- [ ] Production URL access test
- [ ] Create invoice from order (INV-1010)
- [ ] Download PDF → Korean text check
- [ ] Settings save/load test
- [ ] Privacy Policy page accessible

---

## 📝 5. Shopify App Store 제출 절차

### Step 1: Shopify Partners 로그인
- URL: https://partners.shopify.com/
- Account: thss2641@gmail.com
- Navigate: Apps → invoice-generator → App Store Listing

### Step 2: App Store Listing 작성
1. **App Name**: Invoice Generator
2. **Tagline**: Professional PDF invoices in one click
3. **Description**: (Copy from APP_STORE_LISTING.md)
4. **Category**: Orders and shipping
5. **Screenshots**: Upload 5 images (순서대로)
6. **Support**: support@testcompany.kr
7. **Privacy Policy URL**: https://invoice-generator-r60s.onrender.com/privacy

### Step 3: Pricing 설정
- **Free Plan**: Coming Soon (심사 후 추가)
- **Pro Plan**: Coming Soon (심사 후 추가)
- **Note**: Billing API는 심사 기간 중 구현 예정

### Step 4: Submit for Review
- [ ] Click "Submit for Review"
- [ ] Confirmation email → thss2641@gmail.com
- [ ] Expected review time: 3-7 days

---

## ⏳ 6. 심사 기간 중 작업 (3-7일)

### Billing API 구현 (3-5일)
- [ ] Shopify Billing API 연동
- [ ] Free plan: 50 invoices/month, watermark
- [ ] Pro plan: $29/month, unlimited, no watermark, email
- [ ] Subscription management UI

### Email Delivery 준비 (2-3일)
- [ ] Resend.com 계정 생성
- [ ] orders/create webhook 구현
- [ ] PDF 첨부 이메일 발송 로직
- [ ] Email template 디자인

### Protected Customer Data 신청 (심사 후)
- [ ] Manual invoice creation 활성화
- [ ] Automatic email delivery 활성화

---

## 🎯 7. 승인 후 작업 (Week 1-2)

### Day 1: Billing API 활성화
- [ ] Free/Pro plan 활성화
- [ ] Pricing page 업데이트
- [ ] 가격 정보 공개

### Day 3-5: Email Delivery
- [ ] Automatic email on order creation
- [ ] Email sent tracking
- [ ] Dashboard "Emails Sent" 통계 활성화

### Week 2: Logo Upload
- [ ] Cloudinary 연동
- [ ] Settings에 logo upload UI 추가
- [ ] PDF에 logo 렌더링

---

## 📊 8. Success Metrics (6 Months)

### Revenue Target
- **Goal**: $1,000-2,000/month (35-70 Pro subscribers)
- **Break-even**: 35 Pro subscribers ($1,015/month)
- **Optimistic**: 70 Pro subscribers ($2,030/month)

### Key Metrics
- **Install Rate**: 50-100 installs/month (target)
- **Free → Pro Conversion**: 10-20% (industry average)
- **Churn Rate**: <5%/month (target)
- **Rating**: ≥4.5/5.0 (target)

---

## 🔑 Critical Contacts

- **Partners Account**: thss2641@gmail.com
- **Dev Store**: sonsapp-dev.myshopify.com
- **GitHub**: son8894/invoice-generator
- **Database**: Neon PostgreSQL (Singapore)
- **Hosting**: Render.com (invoice-generator-r60s)
- **Support Email**: support@testcompany.kr

---

## ✅ Final Checklist Before Click "Submit"

- [ ] Render deployment: **Live** ✅
- [ ] Production URL working
- [ ] Korean PDF test passed
- [ ] Screenshots uploaded (5장)
- [ ] App Store listing complete
- [ ] Privacy Policy accessible
- [ ] Support email active
- [ ] No console errors in production

---

**When all checked: Click "Submit for Review"** 🚀

Expected approval: March 7-10, 2026  
First revenue: April 2026

---

_Checklist created: 2026-02-24 23:30 KST_
