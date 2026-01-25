# راهنمای استقرار CanScan

## پیش‌نیازها

1. **حساب Vercel**: ثبت‌نام در [vercel.com](https://vercel.com)
2. **Vercel CLI**: نصب CLI برای استقرار
   \`\`\`bash
   npm i -g vercel
   \`\`\`

## مراحل استقرار

### 1. آماده‌سازی پروژه

\`\`\`bash
# بررسی وابستگی‌ها
pnpm install

# بررسی نوع‌ها و خطاها
pnpm type-check
pnpm lint

# تست ساخت محلی
pnpm build
\`\`\`

### 2. تنظیم متغیرهای محیط

در فایل `.env.production` یا پنل Vercel:

\`\`\`env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://canscan.vercel.app
DATABASE_URL="file:./prisma/prod.db"
AUTH_SECRET="your-secure-secret-here"

# اختیاری - برای ویژگی‌های پیشرفته AI
GROK_API_KEY="your-grok-api-key"
GROK_MODEL="grok-3-mini"
\`\`\`

### 3. استقرار با Vercel CLI

\`\`\`bash
# ورود به حساب
vercel login

# استقرار اولیه (حالت توسعه)
vercel

# استقرار نهایی (حالت تولید)
vercel --prod
\`\`\`

### 4. تنظیم دامنه سفارشی

1. در پنل Vercel به پروژه خود بروید
2. به بخش **Settings > Domains** بروید
3. دامنه `canscan.vercel.app` یا دامنه سفارشی خود را اضافه کنید

### 5. تنظیمات امنیتی

در پنل Vercel:

1. **Environment Variables**: متغیرهای محیط را تنظیم کنید
2. **Security Headers**: هدرهای امنیتی به صورت خودکار اعمال می‌شوند
3. **HTTPS**: به صورت خودکار فعال است

## ویژگی‌های خاص

### PWA (Progressive Web App)
- قابلیت نصب روی موبایل و دسکتاپ
- عملکرد آفلاین محدود
- آیکون‌های اختصاصی

### OCR فارسی
- پردازش اسناد فارسی با Tesseract.js
- عملکرد کامل در مرورگر
- بدون نیاز به سرور اضافی

### هوش مصنوعی
- عامل خودمختار برای مدیریت سیستم
- خودترمیمی و خودارتقایی
- تحلیل هوشمند اسناد (با Grok API)

## نکات مهم

1. **مرورگر پشتیبانی شده**: Chrome, Edge, Opera (برای Web USB)
2. **HTTPS الزامی**: برای Web USB API
3. **حافظه**: پردازش OCR نیاز به حافظه کافی دارد
4. **عملکرد**: بهینه‌سازی شده برای سرعت بالا

## عیب‌یابی

### مشکلات رایج:

1. **خطای Build**:
   \`\`\`bash
   pnpm clean
   pnpm install
   pnpm build
   \`\`\`

2. **مشکل Prisma**:
   \`\`\`bash
   pnpm prisma generate
   pnpm prisma db push
   \`\`\`

3. **خطای TypeScript**:
   \`\`\`bash
   pnpm type-check
   \`\`\`

### لاگ‌ها:
- لاگ‌های Vercel: در پنل Functions
- لاگ‌های مرورگر: Developer Tools > Console
- لاگ‌های AI Agent: در داشبورد عامل هوش مصنوعی

## پشتیبانی

برای مشکلات فنی:
1. بررسی لاگ‌های Vercel
2. بررسی Console مرورگر
3. بررسی داشبورد عامل هوش مصنوعی

## به‌روزرسانی

\`\`\`bash
# دریافت آخرین تغییرات
git pull origin main

# استقرار مجدد
vercel --prod
\`\`\`
