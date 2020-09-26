export default {
    route: {
        routeConfig: [
            {
                name: "yungis",
                path: "/yungis",
                meta: {
                    title: "yungis"
                },
                component: resolve => {
                    require(["./main"], resolve);
                }
            }
        ]
    }
};
