export declare const getPaginatedData: (page: number, limit: number) => Promise<{
    data: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
