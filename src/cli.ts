import { HelloCommand } from "@commands/HelloCommand";
import { Command } from "commander";

const program = new Command();

program.name("CindroX-cli").description("CLI tool for the CindroX framework").version("1.0.0");

program.addCommand(new HelloCommand());
// You can add more command classes similarly

program.parse();
