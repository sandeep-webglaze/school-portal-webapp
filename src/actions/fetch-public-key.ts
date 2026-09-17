"use server";

export async function fetchPublicKey() {
  try {
    const publicKey =
      "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz+0HVvwRlalDCBpe/8xF31n4LfRq+YE1StrbV/avdKQ4t5SGFdHtJndUFqBIYVY8kIcUzuoY/bLlFRkuT6YcXjdhD51gsNwQEuTVd18OS55bmSpe127OEFQ4D1Ybp82TAhP1Ch4MNSrFfMZk2S3iL6U9XE/rmfLBGPOtJLbUroz9EbMhZbSh/apE9tecAQy2fuEO5jPKGE7/vu3AgB1khmKuDcFo57s7XzDOoBLEzfWi2gT74eVO7Cbt1dz0wTTU3vwtwjtde7bWijQJjhV75LuQcT4uASksCkDQycz/pBZ2ZfKoeYr6JYQwhQbhucVALwLkhAAx3O5874keV0MY4wIDAQAB-----END PUBLIC KEY-----";
    return publicKey;
  } catch (error) {
    console.error("Err in Fetching Public Key=>", error);
  }
}
