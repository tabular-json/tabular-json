export type ValueGetter<T> = (item: T) => unknown
export type PathGetter = () => Path

export interface Field<T> {
  name: string
  path: Path
  getValue: ValueGetter<T>
}

export type SetValue = (record: Record<string, unknown>, value: unknown) => void

export type TableField = {
  keys: string[]
  setValue: SetValue
}

export type NestedObject = { [key: string]: NestedObject | unknown }

export type Path = (string | number)[]

export type NonEmptyArray<T> = [T, ...T[]]

export type TabularData<T> = NonEmptyArray<Record<string, T>>

export type OutputAsTable = (tabularData: TabularData<T>, path: Path) => boolean
