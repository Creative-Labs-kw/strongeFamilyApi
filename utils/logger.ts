import { createLogger, format, transports } from "winston";

const UserLogger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/user.log" }),
  ],
});

const FamilyLogger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/Family.log" }),
  ],
});

export default { FamilyLogger, UserLogger };
