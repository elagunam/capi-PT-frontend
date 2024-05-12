export interface Address {
    id:         number;
    contact_id: number;
    address:    string;
    city:       string;
    country:    string;
    zip:        string;
    created_at: Date;
    updated_at: Date;
    deleted:    number;
    deleted_at: null;
}

export interface Email {
    id:            number;
    contact_id:    number;
    email?:        string;
    created_at:    Date;
    updated_at:    Date;
    deleted:       number;
    deleted_at:    null;
}

export interface Phone {
    id:            number;
    contact_id:    number;
    created_at:    Date;
    updated_at:    Date;
    deleted:       number;
    deleted_at:    null;
    phone_number?: string;
    type?:         string;
}

export interface Contact {
    id:         number;
    fullname:   string;
    created_at: Date;
    updated_at: Date;
    deleted:    number;
    deleted_at: null;
    phones:     Phone[];
    addresses:  Address[];
    emails:     Email[];
}