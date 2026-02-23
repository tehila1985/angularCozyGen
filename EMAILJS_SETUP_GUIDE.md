# הגדרת EmailJS - שליחת מיילים אמיתית

## שלב 1: הרשמה ל-EmailJS
1. עבור ל-https://www.emailjs.com/
2. לחץ על "Sign Up" והירשם (חינם עד 200 מיילים בחודש)
3. אשר את המייל שלך

## שלב 2: חיבור Gmail
1. לחץ על "Email Services"
2. לחץ על "Add New Service"
3. בחר "Gmail"
4. התחבר עם חשבון Gmail שלך
5. תקבל **Service ID** - שמור אותו

## שלב 3: יצירת תבנית למנהלת
1. לחץ על "Email Templates"
2. לחץ על "Create New Template"
3. שם התבנית: "Admin Contact Form"
4. **Template ID**: שמור אותו (לדוגמה: template_admin)

**תוכן התבנית:**
```
Subject: פנייה חדשה מ-{{from_name}}

שם: {{from_name}}
אימייל: {{from_email}}
טלפון: {{phone}}

הודעה:
{{message}}

---
ניתן להשיב ישירות למייל: {{reply_to}}
```

5. שמור את התבנית

## שלב 4: יצירת תבנית ללקוח
1. צור תבנית נוספת
2. שם: "Customer Confirmation"
3. **Template ID**: שמור אותו (לדוגמה: template_customer)

**תוכן התבנית:**
```
Subject: פנייתך התקבלה - CozyGen

שלום {{to_name}},

{{message}}

בברכה,
צוות CozyGen
```

4. שמור את התבנית

## שלב 5: קבלת Public Key
1. לחץ על "Account" בתפריט
2. לחץ על "General"
3. תמצא את ה-**Public Key** - העתק אותו

## שלב 6: עדכון הקוד
פתח את הקובץ:
`src/app/services/email.ts`

החלף את הערכים הבאים:
```typescript
private serviceId = 'YOUR_SERVICE_ID';           // מהשלב 2
private adminTemplateId = 'YOUR_ADMIN_TEMPLATE_ID';     // מהשלב 3
private customerTemplateId = 'YOUR_CUSTOMER_TEMPLATE_ID'; // מהשלב 4
private publicKey = 'YOUR_PUBLIC_KEY';           // מהשלב 5
```

## שלב 7: בדיקה
1. הרץ את האפליקציה
2. מלא את טופס יצירת הקשר
3. שלח
4. בדוק:
   - המייל של המנהלת (rivka7905@gmail.com)
   - המייל של הלקוח

## זהו! המערכת תשלח מיילים אמיתיים! 🎉

## פתרון בעיות
- אם המיילים לא מגיעים, בדוק את תיקיית הספאם
- ודא שכל ה-IDs נכונים
- בדוק את הקונסול לשגיאות
