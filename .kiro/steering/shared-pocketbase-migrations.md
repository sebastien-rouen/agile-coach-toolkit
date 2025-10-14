---
inclusion: always
---

# PocketBase Migrations - Guide Rapide

## 📋 Règles de base

### Nommage des fichiers
Format : `{timestamp}_{action}_{nom}.js`

Exemples :
- `1757600001_create_poids.js` - Création de collection
- `1757600010_seed_soins.js` - Import de données

### Structure d'une migration

```javascript
/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // Code de migration (up)
  return app.save(collection);
}, (app) => {
  // Code de rollback (down)
  return app.delete(collection);
});
```

## 🆕 Créer une collection

### Template minimal

```javascript
migrate((app) => {
  const collection = new Collection({
    name: "{projet}_{collection}",
    type: "base",
    system: false,
    fields: [
      {
        name: "id",
        type: "text",
        required: true,
        presentable: false,
        primaryKey: true,
        autogeneratePattern: "[a-z0-9]{15}",
        hidden: false
      },
      // Vos champs ici
      {
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
        presentable: false
      },
      {
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
        presentable: false
      }
    ],
    indexes: [],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("{projet}_{collection}");
  return app.delete(collection);
});
```

## 📝 Types de champs

### Text
```javascript
{
  name: "titre",
  type: "text",
  required: true,
  presentable: false
}
```

### Number
```javascript
{
  name: "prix",
  type: "number",
  required: false,
  presentable: false,
  min: 0
}
```

### Date
```javascript
{
  name: "dateNaissance",
  type: "date",
  required: true,
  presentable: false
}
```

### Select (IMPORTANT : values au même niveau que maxSelect)
```javascript
{
  name: "categorie",
  type: "select",
  required: true,
  presentable: false,
  maxSelect: 1,
  values: [
    "valeur1",
    "valeur2",
    "valeur3"
  ]
}
```

### URL
```javascript
{
  name: "url",
  type: "url",
  required: false,
  presentable: false
}
```

### Bool
```javascript
{
  name: "actif",
  type: "bool",
  required: false,
  presentable: false
}
```

## 📥 Importer des données (seed)

### Template de seed

```javascript
migrate((app) => {
  const collection = app.findCollectionByNameOrId("{projet}_{collection}");
  
  const data = [
    { champ1: "valeur1", champ2: 123 },
    { champ1: "valeur2", champ2: 456 }
  ];

  data.forEach(item => {
    const record = new Record(collection);
    record.set("champ1", item.champ1);
    record.set("champ2", item.champ2);
    app.save(record);
  });

  return null;
}, (app) => {
  const records = app.findRecordsByFilter("{projet}_{collection}", "", "-created", 500);
  records.forEach(record => {
    app.delete(record);
  });
  return null;
});
```

## 🔄 Modifier une collection

### Ajouter un champ

```javascript
migrate((app) => {
  const collection = app.findCollectionByNameOrId("{projet}_{collection}");
  
  // Ajouter le nouveau champ à la fin de fields
  collection.fields.push({
    name: "nouveauChamp",
    type: "text",
    required: false,
    presentable: false
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("{projet}_{collection}");
  
  // Retirer le champ ajouté
  collection.fields = collection.fields.filter(f => f.name !== "nouveauChamp");
  
  return app.save(collection);
});
```

## ⚠️ Erreurs courantes

### "values: cannot be blank"
❌ **Mauvais** :
```javascript
{
  name: "type",
  type: "select",
  options: {
    maxSelect: 1,
    values: ["val1", "val2"]
  }
}
```

✅ **Correct** :
```javascript
{
  name: "type",
  type: "select",
  maxSelect: 1,
  values: ["val1", "val2"]
}
```

### "sql: no rows in result set"
La collection n'existe pas encore. Vérifier l'ordre des migrations :
1. Créer la collection (`1757600001_create_xxx.js`)
2. Puis importer les données (`1757600010_seed_xxx.js`)

## 🎯 Bonnes pratiques

1. **Toujours inclure** les champs `id`, `created`, `updated`
2. **Ordre des migrations** : Création avant seed
3. **Nommage cohérent** : `{projet}_{collection}` (ex: `carnet_animaux_soins`)
4. **Timestamps** : Utiliser des timestamps Unix croissants
5. **Rollback** : Toujours implémenter la fonction de rollback
6. **Test** : Tester la migration avant de commiter

## 🚀 Commandes utiles

```bash
# Redémarrer PocketBase (applique les migrations)
pm2 restart pb-{projet}-drafts

# Voir les logs
pm2 logs pb-{projet}-drafts

# Accès admin
http://localhost:{port}/_/
```

### Documentation officielle PocketBase
- **Migrations JS** : https://pocketbase.io/docs/js-migrations/
- **Collections** : https://pocketbase.io/docs/collections/
- **Types de champs** : https://pocketbase.io/docs/collections/#fields
- **Records (CRUD)** : https://pocketbase.io/docs/js-records/
- **Database queries** : https://pocketbase.io/docs/js-database/
- **API Rules** : https://pocketbase.io/docs/api-rules-and-filters/
- **JSVM Reference** : https://pocketbase.io/jsvm/
- **Exemple complet** : https://github.com/rodydavis/rodydavis
