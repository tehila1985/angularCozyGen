import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Style } from '../../models/style.model';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="selection-section">
      <div class="header-container">
        <span class="category-label">PREMIUM CURATION</span>
        <h3 class="style-heading">קולקציות לפי סגנון</h3>
        <p class="style-subtext">גלו את השפה העיצובית שמתאימה לבית שלכם</p>
      </div>

      <div class="rooms-grid">
        <div *ngFor="let room of rooms; let i = index" 
             class="room-card" 
             [class.appear]="isLoaded"
             [style.transition-delay]="(i * 150) + 'ms'">
          
          <div class="card-inner">
            <div class="image-zoom-wrapper">
              <img [src]="room.image" [alt]="room.title" (error)="handleImageError($event)">
            </div>
            
            <div class="card-overlay">
              <div class="top-info">
                <span class="count-pill">{{ room.count }} פריטים מחכים לך</span>
              </div>

              <div class="bottom-content">
                <p class="collection-desc">{{ room.description }}</p>
                <h4 class="room-title">{{ room.title }}</h4>
                
                <button class="modern-btn">
                  <span class="btn-inner">
                    <span class="text">בחירה בסגנון זה</span>
                    <i class="pi pi-arrow-left"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .selection-section { 
      padding: 120px 6%; 
      background: #ffffff; 
      direction: rtl; 
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .header-container { text-align: center; margin-bottom: 100px; }
    
    .category-label { 
      font-size: 1rem; 
      letter-spacing: 6px; 
      color: #b1935b; 
      font-weight: 600; 
      display: block;
      margin-bottom: 20px;
    }

    .style-heading { 
      font-size: 4.5rem; /* כותרת ראשית ענקית ומודרנית */
      font-weight: 200; 
      margin: 0; 
      color: #1a1a1a;
      letter-spacing: -2px;
    }

    .style-subtext { color: #666; font-size: 1.4rem; margin-top: 20px; font-weight: 300; }

    .rooms-grid { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 40px; 
      max-width: 1800px; 
      margin: 0 auto; 
    }

    .room-card { 
      position: relative; 
      aspect-ratio: 1 / 1.45; 
      overflow: hidden; 
      opacity: 0; 
      transform: translateY(40px);
      transition: all 1.2s cubic-bezier(0.2, 1, 0.3, 1);
    }

    .room-card.appear { opacity: 1; transform: translateY(0); }

    .card-inner { width: 100%; height: 100%; position: relative; }
    
    .image-zoom-wrapper { width: 100%; height: 100%; overflow: hidden; }
    
    img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: transform 2s cubic-bezier(0.2, 1, 0.3, 1);
    }

    .room-card:hover img { transform: scale(1.1); }

    .card-overlay { 
      position: absolute; 
      inset: 0; 
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between; 
      padding: 50px;
    }

    .count-pill {
      background: rgba(255, 255, 255, 0.9);
      color: #000;
      padding: 10px 20px;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 2px;
    }

    .bottom-content { color: #fff; }

    .collection-desc { 
      font-size: 1.3rem; /* תיאור מוגדל */
      margin-bottom: 12px; 
      font-weight: 300;
      opacity: 0.95;
      line-height: 1.4;
    }

    .room-title { 
      font-size: 3.5rem; /* כותרת הקלף מוגדלת מאוד */
      font-weight: 700; 
      margin: 0 0 35px 0; 
      line-height: 1;
      letter-spacing: -1px;
    }

    .modern-btn {
      width: 100%;
      background: #fff;
      border: none;
      height: 70px; /* כפתור גבוה יותר */
      cursor: pointer;
      transition: all 0.4s ease;
      opacity: 0;
      transform: translateY(20px);
    }

    .room-card:hover .modern-btn { opacity: 1; transform: translateY(0); }

    .btn-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      color: #000;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .modern-btn:hover { background: #f0f0f0; }

    @media (max-width: 1400px) { 
        .style-heading { font-size: 3.5rem; }
        .room-title { font-size: 2.8rem; }
    }
    @media (max-width: 1100px) { .rooms-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 768px) { 
      .rooms-grid { grid-template-columns: 1fr; } 
      .style-heading { font-size: 2.5rem; }
      .room-title { font-size: 2.2rem; }
      .card-overlay { padding: 30px; }
    }
  `]
})
export class RoomSelection implements OnInit {
  isLoaded = false;
  rooms: Room[] = [];
  private http = inject(HttpClient);
  
  ngOnInit() { this.fetchRooms(); }

  async getProductCountForStyle(styleId: number): Promise<number> {
    const params = new HttpParams().set('position', '1').set('skip', '1').set('styleIds', styleId.toString());
    try {
      const res = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/Product`, { params }));
      return res.totalCount ?? res.TotalCount ?? res.item2 ?? 0;
    } catch { return 0; }
  }

  fetchRooms() {
    const baseUrl = environment.apiUrl.replace('/api', '');
    this.http.get<Style[]>(`${environment.apiUrl}/Style`).subscribe({
      next: async (data) => {
        this.rooms = await Promise.all(data.map(async (s) => {
          const id = s.styleId;
          const count = await this.getProductCountForStyle(id);
          const imgPath = s.imageUrl|| '';
          return {
            id,
            title: (s.name || '').replace(/_/g, ' '),
            description: s.description,
            count: count,
            image: imgPath.startsWith('http') ? imgPath : `${baseUrl}/${imgPath}`
          };
        }));
        setTimeout(() => (this.isLoaded = true), 100);
      }
    });
  }

  handleImageError(e: any) { e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000'; }
}