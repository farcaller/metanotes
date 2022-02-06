import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import { load } from 'js-yaml';
import { makeAutoObservable } from 'mobx';

export const TitleKey = 'mn-title';
export const DraftKey = 'mn-draft';
export const SlugKey = 'mn-slug';
export const ContentTypeKey = 'mn-content-type';

const ajv = new Ajv();
const TagSchemaDefinition: JSONSchemaType<string[]> = {
  // "$schema": "https://json-schema.org/draft/2019-09/schema",
  // "$id": "https://metanotes.org/schemas/v1/tag.schema.json",
  // "title": "Metanotes tag attribute",
  type: 'array',
  items: {
    type: 'string',
  },
};
const TagSchema = ajv.compile(TagSchemaDefinition);

const ListSchemaDefinition: JSONSchemaType<string[]> = {
  // "$schema": "https://json-schema.org/draft/2019-09/schema",
  // "$id": "https://metanotes.org/schemas/v1/tag.schema.json",
  // "title": "Metanotes list attribute",
  type: 'array',
  items: {
    type: 'string',
  },
};
const ListSchema = ajv.compile(ListSchemaDefinition);

export default class ComputedMetadata {
  private meta: Map<string, string>;

  constructor(meta: Map<string, string>) {
    makeAutoObservable<ComputedMetadata, 'meta'>(this, {
      meta: false,
    });
    this.meta = meta;
  }

  private fieldWithSchema<T>(
    field: string,
    schema: ValidateFunction<string[]>,
    empty: T
  ): T {
    const val = this.meta.get(field);
    if (!val) {
      return empty;
    }

    const parsedVal = load(val) as unknown as T;
    if (schema(parsedVal)) {
      return parsedVal;
    }
    // eslint-disable-next-line no-console
    console.error(
      `scribble has an incorrectly formatted field ${field}: ${parsedVal}`
    );
    return empty;
  }

  get tags(): string[] {
    return this.fieldWithSchema('tags', TagSchema, []);
  }

  get list(): string[] {
    return this.fieldWithSchema('list', ListSchema, []);
  }

  get isDraft(): boolean {
    return this.meta.get(DraftKey) === 'true';
  }

  get title(): string {
    return this.meta.get(TitleKey) ?? '';
  }

  get slug(): string {
    return this.meta.get(SlugKey) ?? '';
  }

  get contentType(): string {
    return this.meta.get(ContentTypeKey) ?? '';
  }
}
