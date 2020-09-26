import L from "leaflet";
import Proj from "./proj4leaflet";
import pointconvert from "./pointconvert";

Object.assign(Proj, pointconvert);

L.Proj = Proj;

export default Proj;
