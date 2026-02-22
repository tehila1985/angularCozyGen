# מערכת הזמנות עם PayPal

## מה נוצר:

### 1. Model - order.model.ts
- OrderItem - פריט בהזמנה
- Order - הזמנה מלאה
- CreateOrderRequest - בקשה ליצירת הזמנה

### 2. Service - order.ts
- createOrder() - יצירת הזמנה חדשה
- getOrderById() - קבלת הזמנה לפי מזהה

### 3. Component - checkout
- עמוד תשלום מלא
- אינטגרציה עם PayPal
- סיכום הזמנה
- שמירת הזמנה בדאטה בייס

## איך זה עובד:

1. **משתמש מוסיף מוצרים לעגלה** → נשמר ב-localStorage
2. **לוחץ "מעבר להזמנה"** → בודק אם מחובר, אם לא - מפנה להתחברות
3. **עמוד Checkout** → מציג סיכום + כפתור PayPal
4. **תשלום דרך PayPal** → PayPal Sandbox (דמה)
5. **לאחר תשלום מוצלח** → שומר הזמנה בדאטה בייס דרך API
6. **הזמנה נשמרת עם**:
   - UserId
   - תאריך
   - סטטוס: "Paid"
   - סכום כולל
   - רשימת פריטים

## הגדרת PayPal:

הקוד משתמש ב-PayPal Sandbox (מצב בדיקה).
ל-Production, החלף את:
```javascript
script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=ILS';
```
ב:
```javascript
script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=ILS';
```

## נתיבים:
- `/cart` - עגלת קניות
- `/checkout` - עמוד תשלום
- `/auth` - התחברות (נדרש לפני תשלום)

## API Endpoints בשימוש:
- POST `/api/Order` - יצירת הזמנה חדשה
- GET `/api/Order/{id}` - קבלת הזמנה

## הערות:
- ההזמנה נשמרת רק לאחר תשלום מוצלח
- העגלה מתרוקנת אוטומטית לאחר הזמנה
- המשתמש מקבל הודעת אישור עם מספר הזמנה
