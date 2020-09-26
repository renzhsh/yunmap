import Proj4 from "../proj";

/**
 * 大地2000
 */
const EPSG4490 = new Proj4.CRS(
    "EPSG:4490",
    "+proj=longlat +ellps=GRS80 +no_defs",
    {
        resolutions: [
            1.40625,
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455206208891e-4,
            3.4332276031044456e-4,
            1.7166138015522228e-4,
            8.583069007761114e-5,
            4.291534503880557e-5,
            2.1457672519402785e-5,
            1.0728836259701392e-5,
            5.364418129850696e-6,
            2.682209064925349e-6,
            1.3411045324626745e-6,
            6.705522537e-7
        ],
        origin: [-180, 90],
        bounds: L.bounds([-180, -90], [180, 90])
    }
);

export default EPSG4490;