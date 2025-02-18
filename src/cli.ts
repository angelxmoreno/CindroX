import { HelloCommand } from "@commands/HelloCommand";
import { CookCommandCommand } from "@commands/cook/CookCommandCommand";
import { Command } from "commander";

const program = new Command();

program.name("CindroX-cli").description("CLI tool for the CindroX framework").version("1.0.0");

program.addCommand(new HelloCommand());
program.addCommand(new CookCommandCommand());

program.parse();
