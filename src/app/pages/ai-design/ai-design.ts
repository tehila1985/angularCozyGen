import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AiService } from '../../services/ai';
import { ProductService } from '../../services/product';
import { NotificationService } from '../../services/notification';
import { environment } from '../../../environments/environment.development';
import { TopMenu } from '../../components/top-menu/top-menu';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-ai-design',
  standalone: true,
  imports: [CommonModule, TopMenu],
  templateUrl: './ai-design.html',
  styleUrl: './ai-design.css'
})
export class AiDesignComponent {
  private aiService = inject(AiService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isLoading = false;
  recommendedProducts: any[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.notificationService.show('אנא בחר קובץ תמונה בלבד', 'error');
        return;
      }

      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  analyzeImage() {
    if (!this.selectedFile) {
      this.notificationService.show('אנא בחר תמונה להעלאה', 'error');
      return;
    }

    this.isLoading = true;
    console.log('Starting AI analysis...');
    
    this.aiService.analyzeImage(this.selectedFile)
      .pipe(
        switchMap(response => {
          console.log('AI response:', response);
          return this.productService.getProductsByIds(response.productIds);
        })
      )
      .subscribe({
        next: (products) => {
          console.log('Products received:', products);
          console.log('First product structure:', products[0]);
          console.log('Products length:', products.length);
          console.log('Setting recommendedProducts to:', products);
          this.isLoading = false;
          this.recommendedProducts = products;
          console.log('recommendedProducts after setting:', this.recommendedProducts);
          this.notificationService.show('הניתוח הושלם בהצלחה!', 'success');
        },
        error: (err) => {
          console.error('Full error details:', err);
          this.isLoading = false;
          this.notificationService.show('שגיאה בניתוח התמונה. נסה שוב.', 'error');
        }
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // ===== נוסף עבור ניווט למוצר וטיפול בתמונות =====
  goToProduct(product: any) {
    this.router.navigate(['/item'], {
      queryParams: { 
        product: JSON.stringify(product) 
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${imageUrl}`;
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000';
  }
}
