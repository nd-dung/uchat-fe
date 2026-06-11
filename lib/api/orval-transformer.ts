type OpenApiSchema = Record<string, unknown>

type OpenApiResponse = {
  content?: Record<string, { schema?: OpenApiSchema }>
}

type OpenApiOperation = {
  operationId?: string
  responses?: Record<string, OpenApiResponse>
}

type OpenApiDocument = {
  components?: {
    schemas?: Record<string, OpenApiSchema>
  }
  paths?: Record<string, Record<string, OpenApiOperation>>
}

const SUCCESS_STATUS_CODES = new Set(["200", "201"])
const JSON_CONTENT_TYPES = ["application/json"]

const toPascalCase = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

const getResponseSchemaName = (operationId: string) =>
  `${toPascalCase(operationId)}Response`

const isReferenceSchema = (schema: OpenApiSchema) =>
  typeof schema.$ref === "string"

export default function transformOpenApiSpec(spec: OpenApiDocument) {
  spec.components ??= {}
  spec.components.schemas ??= {}

  for (const methods of Object.values(spec.paths ?? {})) {
    for (const operation of Object.values(methods)) {
      if (!operation.operationId || !operation.responses) continue

      for (const statusCode of SUCCESS_STATUS_CODES) {
        const response = operation.responses[statusCode]
        if (!response?.content) continue

        for (const contentType of JSON_CONTENT_TYPES) {
          const media = response.content[contentType]
          const schema = media?.schema
          if (!schema || isReferenceSchema(schema)) continue

          const schemaName = getResponseSchemaName(operation.operationId)
          spec.components.schemas[schemaName] = schema
          media.schema = { $ref: `#/components/schemas/${schemaName}` }
        }
      }
    }
  }

  return spec
}
