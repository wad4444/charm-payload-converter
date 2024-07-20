# Usage:

```ts
type AtomsMap = {
    dataAtom: Charm.Atom<number>,
}

type ModifiedPayload = SerializeablePayload<AtomsMap>;

// or

type Payload = Charm.SyncPayload<AtomsMap>;
type ModifiedPayload = ToSerializeablePayload<Payload>;

export const PayloadSerializer = createBinarySerializer<ModifiedPayload>();

// somewhere
syncer.connect((player, payload) => {
    const { buffer, blobs } = PayloadSerializer.serialize(toSerializeablePayload(payload));
    Events.sync.fire(player, buffer, blobs);
})

// receive
Events.sync.connect((buffer, blobs) => {
    const modifiedPayload = PayloadSerializer.deserialize(buffer, blobs);
    syncer.sync(fromSerializeablePayload(modifiedPayload));
})
```