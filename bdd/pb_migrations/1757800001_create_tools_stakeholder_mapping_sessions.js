/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = new Collection({
        name: "tools_stakeholder_mapping_sessions",
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
            {
                name: "name",
                type: "text",
                required: true,
                presentable: true,
                min: 1,
                max: 255
            },
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
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: ""
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("tools_stakeholder_mapping_sessions");
    return app.delete(collection);
});
