const widgets = [
    {
        name: "debugbar",
        position: {
            bottom: "40px",
            left: "10%"
        },
        width: "80%",
        disposable: false,
        component: resolve => require(["./debugbar"], resolve)
    },
    {
        name: "hello",
        position: {
            top: "200px",
            left: "20px"
        },
        loader: "dialog",
        title: "hello",
        keepalive: false,
        disposeOther: true,
        component: resolve => require(["./hello"], resolve)
    },{
        name: "layers",
        position: {
            top: "20px",
            right: "20px"
        },
        loader: "dialog",
        title: "图层管理",
        keepalive: false,
        disposeOther: true,
        component: resolve => require(["./layers"], resolve)
    }
];

export default {
    install(L) {
        L.widgets.register(widgets);
    }
};
