export const useTestStore = defineStore("testStore", {
    state: () => ({
        name: "",
        description: "",
    }),
    actions: {
        async fetch() {
            const infos = {
                name: "1",
                description: "description",
            };

            this.name = infos.name;
            this.description = infos.description;
        },
    },
});
