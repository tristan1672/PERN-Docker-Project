type ProgressCallback = (processedBytes: number) => void;
export declare const processCSV: (filePath: string, progressCallback?: ProgressCallback) => Promise<void>;
export {};
