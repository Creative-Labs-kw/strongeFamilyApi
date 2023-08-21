interface DeviceTimeZoneParams {
  localTime: number;
  jwtExpirationInSeconds: number;
}

export function calculateTokenExpiration({
  localTime,
  jwtExpirationInSeconds,
}: DeviceTimeZoneParams): number {
  const timeZoneOffset = new Date().getTimezoneOffset();
  console.log("localTime:", localTime);
  console.log("jwtExpirationInSeconds:", jwtExpirationInSeconds);
  console.log("timeZoneOffset:", timeZoneOffset);

  const expirationTime =
    localTime + jwtExpirationInSeconds * 1000 - timeZoneOffset * 60 * 1000;
  console.log("expirationTime:", expirationTime);

  const expiresIn = Math.floor(expirationTime / 1000); // Convert to seconds
  console.log("expiresIn:", expiresIn);

  return expiresIn;
}
