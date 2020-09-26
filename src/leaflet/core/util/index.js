import { TypeUtil } from "./type"; // 类型工具集
import { UtilHelper } from "./utilHelper";
import x2js from "./x2j";

Object.assign(L.Util, TypeUtil, UtilHelper, { x2js });

export { TypeUtil };
