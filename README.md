# strongeFamilyApi

## To use AuthMiddleware

- Add it here and in the client side add the config that have the token in it using axios

Sure! Here's the explanation of Firestore usage functions in Markdown format:

## Firestore Usage Functions

1. `collection`: The `collection` function is used to reference a collection within the Firestore database. It returns a `CollectionReference` object.

   ```javascript
   const citiesRef = db.collection("cities");
   ```

2. `doc`: The `doc` function is used to reference a specific document within a collection. It returns a `DocumentReference` object.

   ```javascript
   const cityRef = db.collection("cities").doc("LA");
   ```

3. `set`: The `set` function is used to create or overwrite the data in a document. It takes an object representing the data to be set.

   ```javascript
   await cityRef.set({
     name: "Los Angeles",
     state: "California",
     country: "USA",
   });
   ```

4. `get`: The `get` function is used to retrieve the contents of a document as a `DocumentSnapshot` object. It returns a promise that resolves with the snapshot.

   ```javascript
   const snapshot = await cityRef.get();
   const data = snapshot.data();
   ```

5. `update`: The `update` function is used to update specific fields within a document. It takes an object containing the fields to be updated.

   ```javascript
   await cityRef.update({
     population: 4000000,
     attractions: ["Beaches", "Hollywood"],
   });
   ```

6. `delete`: The `delete` function is used to delete a document from the Firestore database.

   ```javascript
   await cityRef.delete();
   ```

7. `add`: The `add` function is used to add a new document to a collection. It generates a new unique document ID and returns a `DocumentReference` to the newly created document.
   ```javascript
   const newCityRef = db.collection("cities").add({
     name: "New City",
     population: 1000000,
   });
   ```

## Firestore Write Operations

Firestore provides several write operations that allow you to interact with collections and documents. These operations are used to create, update, and delete data in Firestore. Here are the main write operations:

### Create a Document

You can create a new document in a collection using the following operations:

- `set`: Overwrites the entire document with the provided data. If the document doesn't exist, it will be created. If it already exists, it will be overwritten.
- `add`: Adds a new document to a collection with an auto-generated document ID. If the document ID is not specified, Firestore generates a unique ID for the document.

### Update a Document

You can update an existing document in a collection using the `update` operation. This operation allows you to modify specific fields of the document.

### Delete a Document

You can delete a document from a collection using the `delete` operation. This operation removes a document from a collection.

### Batch Write

Firestore allows you to perform multiple write operations as a batch using the `batch` operation. This is useful when you need to execute multiple operations atomically, meaning either all operations succeed or all fail. The `batch` operation allows you to enqueue multiple write operations (set, update, delete) and commit them together.
