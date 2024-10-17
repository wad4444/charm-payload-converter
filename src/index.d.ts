/* eslint-disable @typescript-eslint/no-explicit-any */

import { AtomMap, StateOfMap, SyncPayload } from "@rbxts/charm-sync";

type MaybeNone<T> = undefined extends T ? { __exists: false } : never;
type DataTypes = {
	[P in keyof CheckableTypes as P extends keyof CheckablePrimitives ? never : P]: CheckableTypes[P];
};

/**
 * A type that should not be made partial in patches.
 */
type DataType = DataTypes[keyof DataTypes];

type SerializeablePatch<State> =
	| MaybeNone<State>
	| {
			__exists: true;
			value: State extends ReadonlyMap<infer K, infer V> | Map<infer K, infer V>
				? ReadonlyMap<K, SerializeablePatch<V> | { __exists: false }>
				: State extends Set<infer T> | ReadonlySet<infer T>
					? ReadonlyMap<T, true | { __exists: false }>
					: State extends readonly (infer T)[]
						? readonly (SerializeablePatch<T> | { __exists: false } | undefined)[]
						: State extends DataType
							? State
							: State extends object
								? { readonly [P in keyof State]?: SerializeablePatch<State[P]> }
								: State;
	  };

export type SerializeablePayload<Atoms extends AtomMap> =
	| { type: "init"; data: StateOfMap<Atoms> }
	| { type: "patch"; data: SerializeablePatch<StateOfMap<Atoms>> };

export type ToSerializeablePayload<T extends SyncPayload<any>> =
	T extends SyncPayload<infer R> ? (AtomMap extends R ? never : SerializeablePayload<R>) : never;

export type FromSerializeablePayload<T extends SerializeablePayload<any>> =
	T extends SerializeablePayload<infer R> ? (AtomMap extends R ? never : SyncPayload<R>) : never;

export declare function toSerializeablePayload<T extends SyncPayload<any>>(payload: T): ToSerializeablePayload<T>;

export declare function fromSerializeablePayload<T extends SerializeablePayload<any>>(
	payload: T,
): FromSerializeablePayload<T>;
