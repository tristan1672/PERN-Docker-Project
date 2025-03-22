export interface UploadedData {
    post_id: number;
    id: number;
    name: string;
    email: string;
    body: string;
    created_at: string; // Assuming ISO string format from the backend
  }
  
  export interface ApiResponse {
    results: UploadedData[];
    totalPages: number;
    currentPage: number;
  }