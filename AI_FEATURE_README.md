# פיצ'ר עיצוב חכם עם AI

## תיאור
פיצ'ר שמאפשר למשתמשים להעלות תמונה של החלל שלהם ולקבל המלצות מוצרים מותאמות אישית באמצעות בינה מלאכותית.

## מבנה הקבצים

### קומפוננטים
- **ai-design/** - דף העלאת התמונה וניתוח AI
  - `ai-design.ts` - לוגיקת הקומפוננט
  - `ai-design.html` - תבנית HTML
  - `ai-design.css` - עיצוב

### שירותים
- **ai.ts** - שירות לתקשורת עם API של AI
  - `analyzeImage(imageFile: File)` - שולח תמונה לשרת ומקבל רשימת IDs של מוצרים

### Routes
- `/ai-design` - דף העלאת התמונה

## זרימת העבודה

1. **משתמש לוחץ על "התחילו לעצב עם AI"** בדף הבית
2. **עובר לדף AI Design** (`/ai-design`)
3. **מעלה תמונה** - התמונה לא נשמרת בדאטה בייס
4. **לוחץ על "נתח תמונה"** - התמונה נשלחת לשרת
5. **השרת מחזיר** רשימת IDs של מוצרים מומלצים
6. **המשתמש מועבר** לדף המוצרים עם המוצרים המומלצים

## API Endpoint

### POST `/api/ai/analyze`
**Request:**
- Content-Type: `multipart/form-data`
- Body: `FormData` עם שדה `image` (File)

**Response:**
```json
{
  "productIds": [1, 5, 12, 23, 45]
}
```

## דוגמת שימוש

```typescript
// בקומפוננט AI Design
analyzeImage() {
  if (!this.selectedFile) return;
  
  this.aiService.analyzeImage(this.selectedFile).subscribe({
    next: (response) => {
      // response.productIds = [1, 5, 12, 23, 45]
      this.router.navigate(['/products'], {
        queryParams: { aiProducts: response.productIds.join(',') }
      });
    }
  });
}
```

## הצגת המוצרים

המוצרים מוצגים בדף `/products` עם query parameter:
```
/products?aiProducts=1,5,12,23,45
```

הקומפוננט `showproducts` מקבל את ה-IDs ומסנן את המוצרים בהתאם.

## עיצוב

- **גרדיאנט סגול** - רקע מרשים
- **העלאת תמונה** - Drag & Drop או לחיצה
- **תצוגה מקדימה** - של התמונה שנבחרה
- **אנימציות** - חלקות ומקצועיות
- **Responsive** - מותאם לכל המסכים

## הערות חשובות

1. **התמונה לא נשמרת** - היא נשלחת רק לניתוח ולא נשמרת בדאטה בייס
2. **הסרוויס צריך להיות מוכן** - ה-endpoint `/api/ai/analyze` צריך להיות מוכן בצד השרת
3. **טיפול בשגיאות** - יש הודעות שגיאה ברורות למשתמש
4. **Loading state** - אינדיקטור טעינה בזמן הניתוח
