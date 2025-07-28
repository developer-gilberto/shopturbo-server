import { IPartner } from '../interfaces/partnersInterfaces';

export class PartnerShopee {
    protected readonly partnerId;
    protected readonly partnerKey;

    constructor(partner: IPartner) {
        this.partnerId = partner.id;
        this.partnerKey = partner.key;
    }
}
