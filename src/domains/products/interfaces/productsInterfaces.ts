export interface IProduct {
    id: number;
    sku: string;
    categoryId: number;
    name: string;
    stock: number;
    sellingPrice: number;
    costPrice: number;
    governmentTaxes: number;
    imageUrl: string;
}

export interface IExtendedProduct extends IProduct {
    shopId: number;
}
