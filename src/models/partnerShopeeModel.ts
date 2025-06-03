import { IPartner } from '../interfaces/partnersInterfaces';

export class PartnerShopee {
    protected partnerId;
    protected partnerKey;

    constructor(partner: IPartner) {
        this.partnerId = partner.id;
        this.partnerKey = partner.key;
    }
}
