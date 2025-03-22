export interface UploadedData {
  post_id: string;
  id: string;
  name: string;
  email: string;
  body: string;
  created_at: string;
}

export interface ApiResponse {
  data: UploadedData[];
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  }
}
