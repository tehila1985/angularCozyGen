import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-room-selection',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section class="selection-section">
            <div class="header-container">
                <h3 class="style-heading">קולקציות לפי סגנון</h3>
                <p class="style-subtext">גלו את השפה העיצובית שמתאימה לבית שלכם</p>
            </div>
            
            <div class="rooms-grid">
                <div *ngFor="let room of rooms; let i = index"
                     class="room-card"
                     [class.appear]="isLoaded"
                     [style.transition-delay]="(i * 120) + 'ms'">
                    
                    <div class="card-inner">
                        <img [src]="room.image" [alt]="room.title">
                        
                        <div class="card-content">
                            <div class="text-group">
                                <span class="collection-label">{{ room.collection }}</span>
                                <h4 class="room-title">{{ room.title }}</h4>
                                <span class="product-count">{{ room.count }} מוצרים מחכים לך</span>
                            </div>
                            
                            <button class="view-products">
                                <span>בחירה בסגנון זה</span>
                                <i class="pi pi-arrow-left"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    styles: [`
        .selection-section { 
            padding: 100px 5%; 
            background-color: #fff; 
            direction: rtl; 
            font-family: 'Inter', -apple-system, sans-serif;
        }
        
        /* כותרות חיצוניות - שחור נקי */
        .header-container { 
            margin-bottom: 60px; 
            text-align: right;
        }

        .style-heading { 
            font-size: 2.2rem; 
            font-weight: 700; 
            color: #111; 
            margin: 0;
            letter-spacing: -0.5px;
        }

        .style-subtext {
            font-size: 1.1rem;
            color: #666;
            margin-top: 8px;
            font-weight: 300;
        }
        
        .rooms-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 16px; /* מרווח דק ויוקרתי */
            max-width: 1600px; 
            margin: 0 auto; 
        }

        /* אנימציה יציבה */
        .room-card { 
            position: relative;
            aspect-ratio: 1 / 1.25;
            overflow: hidden;
            border-radius: 0; /* ביטול המסגרת העגולה - פינות חדות */
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .room-card.appear {
            opacity: 1;
            transform: translateY(0);
        }

        .card-inner { height: 100%; width: 100%; position: relative; }

        .room-card img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1); 
        }

        .room-card:hover img { 
            transform: scale(1.1); 
        }

        /* תוכן על התמונה - טקסט לבן */
        .card-content { 
            position: absolute; 
            inset: 0;
            padding: 35px; 
            background: linear-gradient(to top, 
                rgba(0,0,0,0.8) 0%, 
                rgba(0,0,0,0.3) 40%, 
                transparent 100%); 
            display: flex; 
            flex-direction: column;
            justify-content: flex-end; 
        }

        .collection-label {
            color: rgba(255,255,255,0.7);
            font-size: 0.7rem;
            letter-spacing: 2px;
            font-weight: 600;
            text-transform: uppercase;
            display: block;
            margin-bottom: 6px;
        }

        .room-title { 
            color: white; /* טקסט לבן על התמונה */
            margin: 0; 
            font-size: 1.8rem; 
            font-weight: 500;
        }

        .product-count {
            color: rgba(255,255,255,0.6);
            font-size: 0.9rem;
            margin-top: 5px;
            display: block;
            font-weight: 300;
        }

        /* כפתור */
        .view-products {
            margin-top: 25px;
            background: #fff;
            border: none;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 14px 24px;
            width: fit-content;
            font-size: 0.9rem;
            font-weight: 600;
            border-radius: 0; /* גם הכפתור עם פינות חדות */
            opacity: 0;
            transform: translateY(15px);
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            cursor: pointer;
        }

        .room-card:hover .view-products {
            opacity: 1;
            transform: translateY(0);
        }

        /* רספונסיביות */
        @media (max-width: 1100px) { 
            .rooms-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 650px) { 
            .rooms-grid { grid-template-columns: 1fr; }
            .style-heading { font-size: 1.8rem; }
        }
    `]
})
export class RoomSelection implements OnInit {
    isLoaded = false;

    rooms = [
        { id: 101, title: 'מינימליזם נורדי', collection: 'Collection 2026', count: 24, image: '/images/PH204076.webp' },
        { id: 102, title: 'תעשייתי מודרני', collection: 'Collection 2026', count: 18, image: '/images/PH204014.webp' },
        { id: 103, title: 'בוהו-שיק חם', collection: 'Premium Line', count: 31, image: '/images/PH202784.webp' },
        { id: 104, title: 'קלאסיקה נצחית', collection: 'Heritage', count: 15, image: '/images/PH202780.webp' },
        { id: 105, title: 'אורבן מודרן', collection: 'Collection 2026', count: 27, image: '/images/PH202348_SHI_001.webp' },
        { id: 106, title: 'רטרו מעודכן', collection: 'Vintage Edit', count: 12, image: '/images/PH200242.webp' }
    ];

    ngOnInit() {
        setTimeout(() => {
            this.isLoaded = true;
        }, 100);
    }
}