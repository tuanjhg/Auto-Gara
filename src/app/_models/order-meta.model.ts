import { PlaceOrderHeader } from './place-order.model';
import { Representative } from '@df_models/representative.model';
export interface GetValueSavedOrder {
    orderPriceTotal: string;
    createdAt: string | Date;
    createdBy: {
        idUser: number;
        firstname: string;
        lastname: string;
        typeuser: number;
    };
    representative: Representative;
    orderId: number;
    orderIdPrextra: number;
    orderMeta: PlaceOrderHeader;
    createdUser: number;
    status: string;
    idcie: number;
    PONumber: string;
    qonbr: number;
    linkPdfSigned: string;
    stampId?: number;
    stamp?: object;
}

export interface QuotationTerms {
    quotationtermid: number;
    cieid: number;
    type: string;
    descrfr: string;
    descren: string;
    seq: number;
}

export interface GetAllSavedOrdersResponse {
    count: number;
    rows: GetValueSavedOrder[];
    quotationTerms: QuotationTerms[];
}
