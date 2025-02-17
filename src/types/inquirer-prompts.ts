import type { Separator, Theme } from "@inquirer/core";
import type { PartialDeep } from "@inquirer/type";

type InputTheme = {
    validationFailureMode: "keep" | "clear";
};

export type InputConfig = {
    message: string;
    default?: string;
    required?: boolean;
    transformer?: (value: string, { isFinal }: { isFinal: boolean }) => string;
    validate?: (value: string) => boolean | string | Promise<boolean | string>;
    theme?: PartialDeep<Theme<InputTheme>>;
};

type SelectTheme = {
    icon: {
        cursor: string;
    };
    style: {
        disabled: (text: string) => string;
        description: (text: string) => string;
    };
    helpMode: "always" | "never" | "auto";
};

type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

export type SelectConfig<Value> = {
    message: string;
    choices: readonly (string | Separator)[] | readonly (Separator | Choice<Value>)[];
    pageSize?: number;
    loop?: boolean;
    default?: unknown;
    theme?: PartialDeep<Theme<SelectTheme>>;
};
