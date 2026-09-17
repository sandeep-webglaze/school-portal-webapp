"use server";

export async function verifyCaptcha(token: string | null) {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=6Lck1WspAAAAAFnVPoslmHxxfNznxVi1-rfOjMmO&response=${token}`,
    {
      method: "post",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const res = await response.json();
  if (res?.success && res?.score >= 0.5) {
    return { success: true };
  } else {
    throw new Error("Something went wrong, please try again!!!");
  }
}
