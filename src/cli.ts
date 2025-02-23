import process from "node:process";
import { HelloCommand } from "@commands/HelloCommand";
import { SendEmailCommand } from "@commands/SendEmailCommand";
import { CookCommandCommand } from "@commands/cook/CookCommandCommand";
import { CookJobCommand } from "@commands/cook/CookJobCommand";
import { CookMiddlewareCommand } from "@commands/cook/CookMiddlewareCommand";
import { Command } from "commander";

const program = new Command();

program.name("CindroX-cli").description("CLI tool for the CindroX framework").version("1.0.0");
program.addCommand(new SendEmailCommand());

program.addCommand(new HelloCommand());
program.addCommand(new CookCommandCommand());
program.addCommand(new CookMiddlewareCommand());
program.addCommand(new CookJobCommand());

program
    .parseAsync(process.argv)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error.message);
        process.exit(-1);
    });
