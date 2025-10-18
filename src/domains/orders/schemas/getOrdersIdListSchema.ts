import z from "zod";

export function getOrdersIdListSchema() {
    return z.object({
        shopId: z.number().int().positive(),
        intervalDays: z.number().int().min(1).max(15),
        pageSize: z.number().int().min(1).max(100),
        timeRangefield: z.enum(["create_time", "update_time"]),
        orderStatus: z.enum([
            "UNPAID",
            "READY_TO_SHIP",
            "PROCESSED",
            "SHIPPED",
            "COMPLETED",
            "IN_CANCEL",
            "CANCELLED",
            "INVOICE_PENDING",
        ]),
    });
}
