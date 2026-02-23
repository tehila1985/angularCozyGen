# הגדרת EmailJS לשליחת מיילים

## שלב 1: התקנת החבילה
```bash
npm install @emailjs/browser
```

## שלב 2: הרשמה ל-EmailJS
1. עבור ל-https://www.emailjs.com/
2. הירשם חינם (עד 200 מיילים בחודש)
3. צור שירות חדש (Gmail)
4. צור 2 תבניות:
   - `template_contact` - למנהלת
   - `template_confirmation` - ללקוח

## שלב 3: תבנית למנהלת (template_contact)
```
Subject: פנייה חדשה מ-{{from_name}}

שם: {{from_name}}
אימייל: {{from_email}}
טלפון: {{phone}}

הודעה:
{{message}}
```

## שלב 4: תבנית ללקוח (template_confirmation)
```
Subject: פנייתך התקבלה - CozyGen

שלום {{to_name}},

{{message}}

בברכה,
צוות CozyGen
```

## שלב 5: עדכן את email.ts
החלף `YOUR_PUBLIC_KEY` ב-Public Key שלך מ-EmailJS

## זהו! המערכת תשלח:
- מייל למנהלת: rivka7905@gmail.com
- מייל אישור ללקוח
