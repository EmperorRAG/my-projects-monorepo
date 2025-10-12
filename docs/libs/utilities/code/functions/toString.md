[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / toString

# Function: toString()

Converts a Stringable value or an array of Stringable values to their string representations.

## Param

The value or array of values to convert.

## See

toString

## Call Signature

> **toString**(`value`): `string`[]

Defined in: [helper-functions/toString.utils.ts:15](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/toString.utils.ts#L15)

Converts an array of Stringable values to an array of strings.

### Parameters

#### value

[`Stringable`](../type-aliases/Stringable.md)[]

An array of values to convert. Each element should be a Stringable (string, number, boolean, or object with a custom toString method).

### Returns

`string`[]

An array of string representations for each element.

### Example

```ts
toString([1, 2, 3]); // ["1", "2", "3"]
toString([{ foo: "bar" }, 7]); // ['{"foo":"bar"}', "7"]
```

## Call Signature

> **toString**(`value`): `string`

Defined in: [helper-functions/toString.utils.ts:26](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/toString.utils.ts#L26)

Converts a single Stringable value to its string representation.

### Parameters

#### value

[`Stringable`](../type-aliases/Stringable.md)

The value to convert. Should be a string, number, boolean, or object with a custom toString method.

### Returns

`string`

The string representation of the value.

### Example

```ts
toString(42); // "42"
toString({ foo: "bar" }); // '{"foo":"bar"}'
```
