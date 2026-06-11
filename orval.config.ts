import { defineConfig } from "orval"

const input = {
  target: "http://127.0.0.1:3001/api/docs/json",
  override: {
    transformer: "lib/api/orval-transformer.ts",
  },
}

export default defineConfig({
  uchat: {
    input,
    output: {
      mode: "tags-split",
      target: "lib/api/generated/uchat.ts",
      schemas: "lib/api/generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      override: {
        mutator: {
          path: "lib/api/axios.ts",
          name: "apiClient",
        },
      },
    },
  },
  uchatZod: {
    input,
    output: {
      mode: "tags-split",
      target: "lib/api/generated/zod",
      client: "zod",
      fileExtension: ".zod.ts",
      clean: true,
    },
  },
})
