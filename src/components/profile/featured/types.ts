export interface FeaturedItem {
  id: string;
  musician_id: string;
  content_type: 'song' | 'video';
  content_id: string;
  display_order: number;
}