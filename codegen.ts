import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "",
    generates: {
        './src/types.ts': {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                contextType: "./context#DataSourceContext",
                mappers: {
                    exampleModel : "models#ExampleModel"
                },
            },
        },
    },
};

export default config;