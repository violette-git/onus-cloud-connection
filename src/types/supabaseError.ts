export interface SupabaseError {
    message: string;
    details?: string;
    hint?: string;
    code: string;
}
