export default [
    {
        name: "debugbar",
        region: {
            position: {
                bottom: "40px",
                left: "10%"
            },
            width: "80%"
        },
        disposable: false,
        component: resolve => require(["./debugbar"], resolve)
    },
    {
        name: "hello",
        region: {
            position: {
                top: "200px",
                left: "20px"
            }
        },
        keepalive: false,
        disposeOther: true,
        component: resolve => require(["./hello"], resolve)
    }
];
