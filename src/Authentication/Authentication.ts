import crypto from 'crypto';

const SECRET = 'km';

export const Authentication = (salt : string , password : string) : string => {
    return crypto.createHmac('SHA256' , [salt , password].join('/')).update(SECRET).digest('hex')
}

export const random = () => crypto.randomBytes(128).toString('base64');