import crypto from 'node:crypto';

export function generateSignature(baseString: string, partner_key: string) {
    const hmac = crypto.createHmac('sha256', partner_key);

    hmac.update(baseString);

    return hmac.digest('hex');
}
