export interface Country {
    pk?: number;
    code?: string;
    name?: string;
    dial_code?: number;
    currency_name?: string;
    currency_symbol?: string;
    currency_code?: string;
    date_created?: Date;
    active?: boolean;
    archived?: boolean;
}
