import MercadoPagoConfig from "mercadopago";

export const MP = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});
