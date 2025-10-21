/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1014723686")

  // update field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2490651244",
    "max": 3000,
    "min": 0,
    "name": "comment",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1014723686")

  // update field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2490651244",
    "max": 1000,
    "min": 0,
    "name": "comment",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
