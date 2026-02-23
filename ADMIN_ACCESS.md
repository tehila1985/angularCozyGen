# גישה לממשק הניהול

## דרכים לגשת לממשק:

### 1. דרך התפריט (אם אתה מנהל):
- התחבר עם משתמש מנהל
- לחץ על אייקון המשתמש בתפריט העליון
- תראה אפשרות "ניהול מערכת" 

### 2. גישה ישירה (זמנית):
נווט ל: `http://localhost:4200/admin`

### 3. בדיקה אם אתה מנהל:
פתח את ה-Console בדפדפן (F12) ובדוק אם יש הודעה:
`Admin status: true` או `Admin status: false`

## אם לא רואה את האפשרות:

### בדוק שה-API מחזיר שאתה מנהל:
1. פתח Network tab בדפדפן (F12)
2. חפש קריאה ל: `/Users/IsAdmin`
3. בדוק שהתשובה היא `true`

### אם ה-API לא קיים:
צריך להוסיף endpoint בצד השרת:
```csharp
[HttpGet("IsAdmin")]
public IActionResult IsAdmin()
{
    // בדוק אם המשתמש הנוכחי הוא מנהל
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var isAdmin = _context.Users.Any(u => u.UserId.ToString() == userId && u.IsAdmin);
    return Ok(isAdmin);
}
```

### פתרון זמני - הצג תמיד:
אם רוצה לראות את הממשק בלי תלות ב-API, ערוך את:
`src/app/components/top-menu/top-menu.html`

החלף:
```html
*ngIf="(userService.isAdmin$ | async)"
```

ב:
```html
*ngIf="userService.isLoggedIn()"
```
