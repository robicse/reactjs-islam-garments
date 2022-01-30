/**
 * API Server Related Constants.
 */

const protocol = process.env.PROTOCOL
const host = process.env.HOST


const api = '/api';
export const baseUrl = `${protocol + host + api}`;


export const webUrl = `${protocol + host}`;
