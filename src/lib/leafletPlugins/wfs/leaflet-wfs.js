/*
* leaflet wfs 按瓦片分块分批加载
* 木遥 qq：346819890   2017-11-01
*/
"use strict";

L.XmlUtil = {
    namespaces: {
        xlink: 'http://www.w3.org/1999/xlink',
        xmlns: 'http://www.w3.org/2000/xmlns/',
        xsd: 'http://www.w3.org/2001/XMLSchema',
        xsi: 'http://www.w3.org/2001/XMLSchema-instance',
        wfs: 'http://www.opengis.net/wfs',
        gml: 'http://www.opengis.net/gml',
        ogc: 'http://www.opengis.net/ogc',
        ows: 'http://www.opengis.net/ows'
    },
    // TODO: find another way to create a new document with doctype text/xml?
    xmldoc: (new DOMParser()).parseFromString('<root />', 'text/xml'),
    setAttributes: function (node, attributes) {
        for (var name in attributes) {
            if (attributes[name] != null && attributes[name].toString) {
                var value = attributes[name].toString();
                var uri = this.namespaces[name.substring(0, name.indexOf(':'))] || null;
                node.setAttributeNS(uri, name, value);
            }
        }
    },
    evaluate: function (xpath, rawxml) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(rawxml, 'text/xml');
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(xmlDoc.documentElement);

        return xpe.evaluate(xpath, xmlDoc, nsResolver, XPathResult.ANY_TYPE, null);
    },
    createElementNS: function (name, attributes, options) {
        options = options || {};
        var uri = options.uri;
        if (!uri) {
            uri = this.namespaces[name.substring(0, name.indexOf(':'))];
        }
        if (!uri) {
            uri = this.namespaces[options.prefix];
        }
        var node = uri ? this.xmldoc.createElementNS(uri, name) : this.xmldoc.createElement(name);
        if (attributes) {
            this.setAttributes(node, attributes);
        }
        if (options.value != null) {
            node.appendChild(this.xmldoc.createTextNode(options.value));
        }
        return node;
    },
    createTextNode: function (value) {
        if (value ||
          value === 0) {

            return this.xmldoc.createTextNode(value);
        }
        return this.xmldoc.createTextNode('');
    },
    getNodeText: function (node) {
        if (!node) {
            return '';
        }
        return node.innerText || node.textContent || node.text;
    },
    serializeXmlDocumentString: function (node) {
        var doc = document.implementation.createDocument('', '', null);
        doc.appendChild(node);
        var serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
    },
    serializeXmlToString: function (node) {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    },
    parseXml: function (rawXml) {
        if (typeof window.DOMParser !== 'undefined') {
            return (new window.DOMParser()).parseFromString(rawXml, 'text/xml');
        } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
            var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(rawXml);
            return xmlDoc;
        } else {
            throw new Error('No XML parser found');
        }
    },
    parseOwsExceptionReport: function (rawXml) {
        var exceptionReportElement = L.XmlUtil.parseXml(rawXml).documentElement;
        if (!exceptionReportElement || exceptionReportElement.tagName !== 'ows:ExceptionReport') {
            return null;
        }
        var exceptionReport = {
            exceptions: [],
            message: ''
        };
        var exceptionsNodes = exceptionReportElement.getElementsByTagNameNS(L.XmlUtil.namespaces.ows, 'Exception');
        for (var i = 0, exceptionsNodesCount = exceptionsNodes.length; i < exceptionsNodesCount; i++) {
            var exceptionNode = exceptionsNodes[i];
            var exceptionCode = exceptionNode.getAttribute('exceptionCode');
            var exceptionsTextNodes = exceptionNode.getElementsByTagNameNS(L.XmlUtil.namespaces.ows, 'ExceptionText');
            var exception = {
                code: exceptionCode,
                text: ''
            };
            for (var j = 0, textNodesCount = exceptionsTextNodes.length; j < textNodesCount; j++) {
                var exceptionTextNode = exceptionsTextNodes[j];
                var exceptionText = exceptionTextNode.innerText || exceptionTextNode.textContent || exceptionTextNode.text;

                exception.text += exceptionText;
                if (j < textNodesCount - 1) {
                    exception.text += '. ';
                }
            }
            exceptionReport.message += exception.code + ' - ' + exception.text;
            if (i < exceptionsNodesCount - 1) {
                exceptionReport.message += ' ';
            }
            exceptionReport.exceptions.push(exception);
        }
        return exceptionReport;
    }
};

L.Util.request = function (options) {
    options = L.extend({
        async: true,
        method: 'POST',
        data: '',
        params: {},
        headers: {},
        url: window.location.href,
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log('Ajax request fail');
            console.log(data);
        },
        complete: function () {
        }
    }, options);

    // good bye IE 6,7
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                options.success(xhr.responseText);
            } else {
                options.error(xhr.responseText);
            }
            options.complete();
        }
    };

    var url = options.url + L.Util.getParamString(options.params, options.url);

    xhr.open(options.method, url, options.async);
    for (var header in options.headers) {
        xhr.setRequestHeader(header, options.headers[header]);
    }

    xhr.send(options.data);
};

L.Filter = {};

L.filter = function (filters) {
    var result = L.XmlUtil.createElementNS('ogc:Filter');

    if (Array.isArray(filters)) {
        filters.forEach(function (element) {
            result.appendChild(element.toGml());
        });
    } else if (filters) {
        result.appendChild(filters.toGml());
    }

    return result;
};

L.Filter.propertyName = function (value) {
    return L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: value });
};

L.Filter.literal = function (value) {
    return L.XmlUtil.createElementNS('ogc:Literal', {}, { value: value });
};

L.Filter.element = function (value) {
    if (value instanceof Element) {
        return value;
    }

    return value.toGml();
};

L.Filter.propertyElement = function (value) {
    if (value instanceof Element) {
        return value;
    }

    if (value && typeof (value.toGml) === "function") {
        return value.toGml();
    }

    return L.Filter.propertyName(value);
};

L.Filter.literalElement = function (value) {
    if (value instanceof Element) {
        return value;
    }

    if (value && typeof (value.toGml) === "function") {
        return value.toGml();
    }

    return L.Filter.literal(value);
};

L.Filter.Abstract = L.Class.extend({
    attributes: {},

    options: {},

    tagName: null,

    buildFilterContent: function () {
        throw "Build filter content is abstract and should be implemented";
    },

    toGml: function () {
        var filterElement = L.XmlUtil.createElementNS(this.tagName, this.attributes, this.options);
        this.buildFilterContent(filterElement);
        return filterElement;
    }
});

L.Filter.BinarySpatial = L.Filter.Abstract.extend({
    initialize: function (propertyName, value, crs) {
        this.propertyName = propertyName;
        this.value = value;
        this.crs = crs;
    },

    buildFilterContent: function (filterElement) {
        filterElement.appendChild(L.Filter.propertyName(this.propertyName));
        if (typeof (this.value) === "string") {
            filterElement.appendChild(L.Filter.propertyName(this.value));
        } else {
            filterElement.appendChild(this.value.toGml(this.crs));
        }
        return filterElement;
    }
});

L.Filter.Equals = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Equals'
});

L.Filter.equals = function (options) {
    return new L.Filter.Equals(options);
};

L.Filter.Disjoint = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Disjoint'
});

L.Filter.disjoint = function (options) {
    return new L.Filter.Disjoint(options);
};

L.Filter.Touches = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Touches'
});

L.Filter.touches = function (options) {
    return new L.Filter.Touches(options);
};

L.Filter.Within = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Within'
});

L.Filter.within = function (options) {
    return new L.Filter.Within(options);
};

L.Filter.Overlaps = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Overlaps'
});

L.Filter.overlaps = function (options) {
    return new L.Filter.Overlaps(options);
};

L.Filter.Crosses = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Crosses'
});

L.Filter.crosses = function (options) {
    return new L.Filter.Crosses(options);
};

L.Filter.Intersects = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Intersects'
});

L.Filter.intersects = function (options) {
    return new L.Filter.Intersects(options);
};

L.Filter.Contains = L.Filter.BinarySpatial.extend({
    tagName: 'ogc:Contains'
});

L.Filter.contains = function (options) {
    return new L.Filter.Contains(options);
};

L.Filter.DistanceBuffer = L.Filter.Abstract.extend({
    initialize: function (propertyName, geometry, crs, distance, units) {
        this.propertyName = propertyName;
        this.geomerty = geometry;
        this.crs = crs;
        this.distance = distance;
        this.units = units;
    },

    buildFilterContent: function (filterElement) {
        filterElement.appendChild(L.Filter.propertyName(this.propertyName));
        filterElement.appendChild(this.geomerty.toGml(this.crs));
        filterElement.appendChild(L.XmlUtil.createElementNS('ogc:Distance', { 'units': this.units }, { value: this.distance }));
    }
});

L.Filter.DWithin = L.Filter.DistanceBuffer.extend({
    tagName: 'ogc:DWithin'
});

L.Filter.dwithin = function (propertyName, geometry, crs, distance, units) {
    return new L.Filter.DWithin(propertyName, geometry, crs, distance, units);
};

L.Filter.Beyond = L.Filter.DistanceBuffer.extend({
    tagName: 'ogc:Beyond'
});

L.Filter.beyond = function (propertyName, geometry, crs, distance, units) {
    return new L.Filter.Beyond(propertyName, geometry, crs, distance, units);
};

L.Filter.BBox = L.Filter.Abstract.extend({
    tagName: 'ogc:BBOX',

    geometryField: null,

    bbox: null,

    crs: null,

    initialize: function (geometryField, bbox, crs) {
        this.bbox = bbox;
        this.geometryField = geometryField;
        this.crs = crs;
    },

    buildFilterContent: function (filterElement) {
        if (this.geometryField) {
            filterElement.appendChild(L.Filter.propertyName(this.geometryField));
        }

        filterElement.appendChild(this.bbox.toGml(this.crs));
    }
});

L.Filter.bbox = function (geometryField, bbox, crs) {
    return new L.Filter.BBox(geometryField, bbox, crs);
};

L.Filter.GmlObjectID = L.Filter.Abstract.extend({
    tagName: 'ogc:GmlObjectId',

    initialize: function (id) {
        this.attributes = { 'gml:id': id };
    },

    buildFilterContent: function () {
    }
});

L.Filter.gmlobjectid = function (id) {
    return new L.Filter.GmlObjectID(id);
};

L.Filter.BinaryOperator = L.Filter.Abstract.extend({
    initialize: function (firstValue, secondValue) {
        this.firstValue = firstValue;
        this.secondValue = secondValue;
    },

    buildFilterContent: function (filterElement) {
        filterElement.appendChild(L.Filter.propertyElement(this.firstValue));
        filterElement.appendChild(L.Filter.literalElement(this.secondValue));
    }
});

L.Filter.Add = L.Filter.BinaryOperator.extend({
    tagName: 'Add'
});

L.Filter.add = function (a, b) {
    return new L.Filter.Add(a, b);
};

L.Filter.Sub = L.Filter.BinaryOperator.extend({
    tagName: 'Sub'
});

L.Filter.sub = function (a, b) {
    return new L.Filter.Sub(a, b);
};

L.Filter.Mul = L.Filter.BinaryOperator.extend({
    tagName: 'Mul'
});

L.Filter.mul = function (a, b) {
    return new L.Filter.Mul(a, b);
};

L.Filter.Div = L.Filter.BinaryOperator.extend({
    tagName: 'Div'
});

L.Filter.div = function (a, b) {
    return new L.Filter.Div(a, b);
};

L.Filter.BinaryComparison = L.Filter.BinaryOperator.extend({
    attributes: {
        matchCase: false
    },

    initialize: function (firstValue, secondValue, matchCase) {
        L.Filter.BinaryOperator.prototype.initialize.call(this, firstValue, secondValue);
        this.attributes.matchCase = !!matchCase;
    }
});

L.Filter.EQ = L.Filter.BinaryComparison.extend({
    tagName: 'ogc:PropertyIsEqualTo'
});

L.Filter.eq = function (firstValue, secondValue) {
    return new L.Filter.EQ(firstValue, secondValue);
};

L.Filter.NotEQ = L.Filter.BinaryComparison.extend({
    tagName: 'ogc:PropertyIsNotEqualTo'
});

L.Filter.neq = function (firstValue, secondValue) {
    return new L.Filter.NotEQ(firstValue, secondValue);
};

L.Filter.LT = L.Filter.BinaryComparison.extend({
    tagName: 'ogc:PropertyIsLessThan'
});

L.Filter.lt = function (firstValue, secondValue) {
    return new L.Filter.LT(firstValue, secondValue);
};

L.Filter.GT = L.Filter.BinaryComparison.extend({
    tagName: 'ogc:PropertyIsGreaterThan'
});

L.Filter.gt = function (firstValue, secondValue) {
    return new L.Filter.GT(firstValue, secondValue);
};

L.Filter.LEQ = L.Filter.BinaryComparison.extend({
    tagName: 'ogc:PropertyIsLessThanOrEqualTo'
});

L.Filter.leq = function (firstValue, secondValue) {
    return new L.Filter.LEQ(firstValue, secondValue);
};

L.Filter.GEQ = L.Filter.BinaryComparison.extend({
    tagName: 'ogc:PropertyIsGreaterThanOrEqualTo'
});

L.Filter.geq = function (firstValue, secondValue) {
    return new L.Filter.GEQ(firstValue, secondValue);
};

L.Filter.Like = L.Filter.Abstract.extend({
    tagName: 'ogc:PropertyIsLike',

    attributes: {
        wildCard: '*',
        singleChar: '#',
        escapeChar: '!',
        matchCase: true
    },

    initialize: function (name, val, attributes) {
        this.name = name;
        this.val = val;
        this.attributes = L.extend(this.attributes, attributes || {});
    },

    buildFilterContent: function (filterElement) {
        var nameElement = L.Filter.propertyName(this.name);
        var valueElement = L.Filter.literal(this.val);
        filterElement.appendChild(nameElement);
        filterElement.appendChild(valueElement);
        return filterElement;
    }
});

L.Filter.like = function (name, val, attributes) {
    return new L.Filter.Like(name, val, attributes);
};

L.Filter.IsNull = L.Filter.Abstract.extend({
    tagName: 'ogc:PropertyIsNull',

    initialize: function (propertyName) {
        this.propertyName = propertyName;
    },

    buildFilterContent: function (filterElement) {
        filterElement.appendChild(L.Filter.propertyName(this.propertyName));
    }
});

L.Filter.isnull = function (propertyName) {
    return new L.Filter.IsNull(propertyName);
};

L.Filter.IsBetween = L.Filter.Abstract.extend({
    tagName: 'ogc:PropertyIsBetween',

    initialize: function (property, lowerBoundary, upperBoundary) {
        this.property = property;
        this.lowerBoundary = lowerBoundary;
        this.upperBoundary = upperBoundary;
    },

    buildFilterContent: function (filterElement) {
        filterElement.appendChild(L.Filter.propertyElement(this.property));

        var lowerBoundaryElement = L.XmlUtil.createElementNS('ogc:LowerBoundary');
        lowerBoundaryElement.appendChild(L.Filter.literalElement(this.lowerBoundary));

        filterElement.appendChild(lowerBoundaryElement);

        var upperBoundaryElement = L.XmlUtil.createElementNS('ogc:UpperBoundary');
        upperBoundaryElement.appendChild(L.Filter.literalElement(this.upperBoundary));

        filterElement.appendChild(upperBoundaryElement);
    }
});

L.Filter.isbetween = function (property, lowerBoundary, upperBoundary) {
    return new L.Filter.IsBetween(property, lowerBoundary, upperBoundary);
};

L.Filter.BinaryLogic = L.Filter.Abstract.extend({
    filters: null,

    initialize: function () {
        var filters = [];
        for (var i = 0; i < arguments.length; i++) {
            filters.push(arguments[i]);
        }

        this.filters = filters;
    },

    buildFilterContent: function (filterElement) {
        this.filters.forEach(function (filter) {
            filterElement.appendChild(L.Filter.element(filter));
        });
    }
});

L.Filter.And = L.Filter.BinaryLogic.extend({
    tagName: 'And'
});

L.Filter.and = function () {
    return new (Function.prototype.bind.apply(L.Filter.And, arguments))();
};

L.Filter.Or = L.Filter.BinaryLogic.extend({
    tagName: 'Or'
});

L.Filter.or = function () {
    return new (Function.prototype.bind.apply(L.Filter.Or, arguments))();
};

L.Filter.Not = L.Filter.Abstract.extend({
    tagName: 'Not',

    initialize: function (filter) {
        this.filter = filter;
    },

    buildFilterContent: function (filterElement) {
        filterElement.appendChild(L.Filter.element(this.filter));
    }
});

L.Filter.not = function (filter) {
    return new L.Filter.Not(filter);
};

L.Filter.Function = L.Filter.Abstract.extend({
    tagName: 'Function',

    initialize: function () {
        var functionName = arguments[0];
        this.attributes = { name: functionName };
        var expressions = [];
        for (var i = 1; i < arguments.length; i++) {
            expressions.push(arguments[i]);
        }

        this.expressions = expressions;
    },

    buildFilterContent: function (filterElement) {
        var firstArgument = this.expressions[0];
        filterElement.appendChild(L.Filter.propertyElement(firstArgument));

        for (var i = 1; i < this.expressions.length; i++) {
            var functionArgument = this.expressions[i];
            filterElement.appendChild(L.Filter.literalElement(functionArgument));
        }
    }
});

L.Filter.function = function () {
    return new (Function.prototype.bind.apply(L.Filter.Function, arguments))();
};

L.Format = {};

L.Format.Scheme = L.Class.extend({
    options: {
        geometryField: 'Shape',
    },

    initialize: function (options) {
        L.setOptions(this, options);
    },

    parse: function (element) {
        var featureType = new L.GML.FeatureType({
            geometryField: this.options.geometryField
        });
        var complexTypeDefinition = element.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'complexType')[0];
        var properties = complexTypeDefinition.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'sequence')[0];
        for (var i = 0; i < properties.childNodes.length; i++) {
            var node = properties.childNodes[i];
            if (node.nodeType !== document.ELEMENT_NODE) {
                continue;
            }

            var propertyAttr = node.attributes.name;
            if (!propertyAttr) {
                continue;
            }

            var propertyName = node.attributes.name.value;
            if (propertyName === this.options.geometryField) {
                continue;
            }

            var typeAttr = node.attributes.type;
            if (!typeAttr) {
                var restriction = node.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'restriction');
                typeAttr = restriction.attributes.base;
            }

            if (!typeAttr) {
                continue;
            }

            var typeName = typeAttr.value.split(':').pop();

            featureType.appendField(propertyName, typeName);
        }

        return featureType;
    }
});

L.Format.Base = L.Class.extend({
    defaultOptions: {
        crs: L.CRS.EPSG3857,
        coordsToLatLng: function (coords) {
            return new L.LatLng(coords[1], coords[0], coords[2]);
        },
        latLngToCoords: function (latlng) {
            var coords = [latlng.lng, latlng.lat];
            if (latlng.alt !== undefined) {
                coords.push(latlng.alt);
            }
            return coords;
        },
        geometryField: 'Shape'
    },

    initialize: function (options) {
        L.setOptions(this, L.extend({}, this.defaultOptions, options));
        if (options.crs) {
            var crs = options.crs;
            this.options.coordsToLatLng = function (coords) {
                var point = L.point(coords[0], coords[1]);
                var ll = crs.projection.unproject(point);
                if (coords[2]) {
                    ll.alt = coords[2];
                }
                return ll;
            };
            this.options.latLngToCoords = function (ll) {
                var latLng = L.latLng(ll);
                return crs.projection.project(latLng);
            };
        }
    },

    setFeatureDescription: function (featureInfo) {
        this.namespaceUri = featureInfo.attributes.targetNamespace.value;
        var schemeParser = new L.Format.Scheme({
            geometryField: this.options.geometryField
        });
        this.featureType = schemeParser.parse(featureInfo);
    }
});

L.Format.GeoJSON = L.Format.Base.extend({

    initialize: function (options) {
        L.Format.Base.prototype.initialize.call(this, options);

        //this.options = L.mars.layer.processArcgisFeatureConfig(options)

        this.outputFormat = 'application/json';
    },

    responseToLayers: function (rawData, opts) {
        if (opts) {
            for (var key in opts) {
                if (opts[key])
                    this.options[key] = opts[key];
            }
        }

        var layers = [];
        var geoJson = JSON.parse(rawData);

        for (var i = 0; i < geoJson.features.length; i++) {
            layers.push(this.processFeature(geoJson.features[i]));
        }

        return layers;
    },

    processFeature: function (feature) {
        var layer = this.generateLayer(feature);
        layer.feature = feature;
        return layer;
    },

    generateLayer: function (feature) {
        return L.GeoJSON.geometryToLayer(feature, this.options || null);
    }
});

L.GML = L.GML || {};

L.GML.ParserContainerMixin = {

    parsers: {},

    initializeParserContainer: function () {
        this.parsers = {};
    },

    appendParser: function (parser) {
        this.parsers[parser.elementTag] = parser;
    },

    parseElement: function (element, options) {
        var parser = this.parsers[element.tagName];
        if (!parser) throw ('unknown child element ' + element.tagName);

        return parser.parse(element, options);
    }
};

L.GML.Element = L.Class.extend({
    elementTag: '',
    parse: function () {
        throw ('not implemented parse function in parser for ' + this.elementTag);
    }
});

L.GML.Geometry = L.GML.Element.extend({
    statics: {
        DIM: 2
    },

    dimensions: function (element) {
        if (element.attributes.srsDimension) {
            return parseInt(element.attributes.srsDimension.value);
        }

        return L.GML.Geometry.DIM;
    }
});

L.GML.Coordinates = L.GML.Element.extend({

    defaultSeparator: {
        ds: '.', //decimal separator
        cs: ',', // component separator
        ts: ' ' // tuple separator
    },

    initialize: function () {
        this.elementTag = 'gml:coordinates';
    },

    parse: function (element) {

        var ds = this.defaultSeparator.ds;
        if (element.attributes.decimal) {
            ds = element.attributes.decimal.value;
        }

        var cs = this.defaultSeparator.cs;
        if (element.attributes.cs) {
            cs = element.attributes.cs.value;
        }

        var ts = this.defaultSeparator.ts;
        if (element.attributes.ts) {
            ts = element.attributes.ts.value;
        }

        var result = [];
        var coords = element.textContent.split(ts);

        var mapFunction = function (coord) {
            if (ds !== '.') {
                coord = coord.replace(ds, '.');
            }

            return parseFloat(coord);
        };

        for (var i = 0; i < coords.length; i++) {
            result.push(coords[i].split(cs).map(mapFunction));
        }

        if (result.length === 1) {
            return result[0];
        }

        return result;
    }
});

L.GML.Pos = L.GML.Element.extend({
    initialize: function () {
        this.elementTag = 'gml:pos';
    },

    parse: function (element) {
        return element.textContent.split(' ').map(function (coord) {
            return parseFloat(coord);
        });
    }
});

L.GML.PosList = L.GML.Element.extend({
    initialize: function () {
        this.elementTag = 'gml:posList';
    },

    parse: function (element, options) {
        var result = [];
        var dim = options.dimensions;
        var coords = element.textContent.split(' ');
        for (var i = 0; i < coords.length; i += dim) {
            var coord = [];
            for (var j = i; j < i + dim; j++) {
                coord.push(parseFloat(coords[j]));
            }
            result.push(coord);
        }

        return result;
    }
});

L.GML.PointNode = L.GML.Geometry.extend({
    includes: L.GML.ParserContainerMixin,

    initialize: function () {
        this.elementTag = 'gml:Point';
        this.initializeParserContainer();
        this.appendParser(new L.GML.Pos());
        this.appendParser(new L.GML.Coordinates());
    },

    parse: function (element) {
        return this.parseElement(element.firstChild, { dimensions: this.dimensions(element) });
    }
});

L.GML.PointSequence = L.GML.Geometry.extend({
    includes: L.GML.ParserContainerMixin,

    initialize: function () {
        this.initializeParserContainer();
        this.appendParser(new L.GML.Pos());
        this.appendParser(new L.GML.PosList());
        this.appendParser(new L.GML.Coordinates());
        this.appendParser(new L.GML.PointNode());
    },

    parse: function (element) {
        var firstChild = element.firstChild;
        var coords = [];
        var tagName = firstChild.tagName;
        if (tagName === 'gml:pos' || tagName === 'gml:Point') {
            var childParser = this.parsers[tagName];
            var elements = element.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, tagName.split(':').pop());
            for (var i = 0; i < elements.length; i++) {
                coords.push(childParser.parse(elements[i]));
            }
        }
        else {
            coords = this.parseElement(firstChild, { dimensions: this.dimensions(element) });
        }

        return coords;
    }
});

L.GML.LinearRing = L.GML.PointSequence.extend({
    initialize: function () {
        L.GML.PointSequence.prototype.initialize.call(this);
        this.elementTag = 'gml:LinearRing';
    },

    parse: function (element) {
        var coords = L.GML.PointSequence.prototype.parse.call(this, element);
        //for leaflet polygons its not recommended insert additional last point equal to the first one
        coords.pop();
        return coords;
    }
});

L.GML.LineStringNode = L.GML.PointSequence.extend({
    initialize: function () {
        this.elementTag = 'gml:LineString';
        L.GML.PointSequence.prototype.initialize.call(this);
    },

    parse: function (element) {
        return L.GML.PointSequence.prototype.parse.call(this, element);
    }
});

L.GML.PolygonNode = L.GML.Geometry.extend({

    initialize: function () {
        this.elementTag = 'gml:Polygon';
        this.linearRingParser = new L.GML.LinearRing();
    },

    parse: function (element) {
        var coords = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            //there can be exterior and interior, by GML standard and for leaflet its not significant
            var child = element.childNodes[i];
            if (child.nodeType === document.ELEMENT_NODE) {
                coords.push(this.linearRingParser.parse(child.firstChild));
            }
        }

        return coords;
    }
});

L.GML.CoordsToLatLngMixin = {
    transform: function (coordinates, options) {
        if (Array.isArray(coordinates[0])) {
            var latLngs = [];
            for (var i = 0; i < coordinates.length; i++) {
                latLngs.push(this.transform(coordinates[i], options));
            }

            return latLngs;
        }

        return options.coordsToLatLng(coordinates);
    }
};

L.GML.Point = L.GML.PointNode.extend({
    includes: L.GML.CoordsToLatLngMixin,

    parse: function (element, options) {
        var coords = L.GML.PointNode.prototype.parse.call(this, element);
        var layer = new L.Marker();
        layer.setLatLng(this.transform(coords, options));
        return layer;
    }
});

L.GML.LineString = L.GML.LineStringNode.extend({

    includes: L.GML.CoordsToLatLngMixin,

    parse: function (element, options) {
        var layer = new L.Polyline([]);
        var coordinates = L.GML.LineStringNode.prototype.parse.call(this, element);
        layer.setLatLngs(this.transform(coordinates, options));
        return layer;
    }
});

L.GML.Polygon = L.GML.PolygonNode.extend({

    includes: L.GML.CoordsToLatLngMixin,

    parse: function (element, options) {
        var layer = new L.Polygon([]);
        var coordinates = L.GML.PolygonNode.prototype.parse.call(this, element);
        layer.setLatLngs(this.transform(coordinates, options));
        return layer;
    }
});

L.GML.MultiGeometry = L.GML.Geometry.extend({
    includes: [L.GML.ParserContainerMixin, L.GML.CoordsToLatLngMixin],

    initialize: function () {
        this.initializeParserContainer();
    },

    parse: function (element, options) {
        var childObjects = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            var geometryMember = element.childNodes[i];
            if (geometryMember.nodeType !== document.ELEMENT_NODE) continue;

            for (var j = 0; j < geometryMember.childNodes.length; j++) {
                var singleGeometry = geometryMember.childNodes[j];
                if (singleGeometry.nodeType !== document.ELEMENT_NODE) continue;

                childObjects.push(this.parseElement(singleGeometry, options));
            }
        }

        return this.transform(childObjects, options);
    }
});

L.GML.AbstractMultiPolyline = L.GML.MultiGeometry.extend({

    initialize: function () {
        L.GML.MultiGeometry.prototype.initialize.call(this);
        this.appendParser(new L.GML.LineStringNode());
    },

    parse: function (element, options) {
        var latLngs = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
        var layer = new L.Polyline([]);
        layer.setLatLngs(latLngs);
        return layer;
    }
});

L.GML.AbstractMultiPolygon = L.GML.MultiGeometry.extend({

    initialize: function () {
        L.GML.MultiGeometry.prototype.initialize.call(this);
        this.appendParser(new L.GML.PolygonNode());
    },

    parse: function (element, options) {
        var latLngs = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
        var layer = new L.Polygon([]);
        layer.setLatLngs(latLngs);
        return layer;
    }
});

L.GML.MultiLineString = L.GML.AbstractMultiPolyline.extend({
    initialize: function () {
        L.GML.AbstractMultiPolyline.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiLineString';
    }
});

L.GML.MultiCurve = L.GML.AbstractMultiPolyline.extend({
    initialize: function () {
        L.GML.AbstractMultiPolyline.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiCurve';
    }
});

L.GML.MultiPolygon = L.GML.AbstractMultiPolygon.extend({
    initialize: function () {
        L.GML.AbstractMultiPolygon.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiPolygon';
    }
});

L.GML.MultiSurface = L.GML.AbstractMultiPolygon.extend({
    initialize: function () {
        L.GML.AbstractMultiPolygon.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiSurface';
    }
});

L.GML.MultiPoint = L.GML.MultiGeometry.extend({
    initialize: function () {
        L.GML.MultiGeometry.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiPoint';
        this.appendParser(new L.GML.PointNode());
    },

    parse: function (element, options) {
        var coordinates = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
        var multiPoint = new L.FeatureGroup();
        for (var i = 0; i < coordinates.length; i++) {
            var point = new L.Marker();
            point.setLatLng(coordinates[i]);
            multiPoint.addLayer(point);
        }

        return multiPoint;
    }
});

L.GML.FeatureType = L.Class.extend({
    options: {
        geometryField: 'Shape',
    },

    primitives: [
      {
          types: ['byte', 'decimal', 'int', 'integer', 'long', 'short'],
          parse: function (input) {
              return Number(input);
          }
      },
      {
          types: ['string'],
          parse: function (input) {
              return input;
          }
      },
      {
          types: ['boolean'],
          parse: function (input) {
              return input !== 'false';
          }
      },
      {
          types: ['date', 'time', 'datetime'],
          parse: function (input) {
              return new Date(input);
          }
      }
    ],

    initialize: function (options) {
        L.setOptions(this, options);

        this.fields = {};
    },

    appendField: function (name, type) {
        var that = this;
        this.primitives.forEach(function (primitive) {
            if (primitive.types.indexOf(type) !== -1) {
                that.fields[name] = primitive.parse;
            }
        });
    },

    parse: function (feature) {
        var properties = {};
        for (var i = 0; i < feature.childNodes.length; i++) {
            var node = feature.childNodes[i];
            if (node.nodeType !== document.ELEMENT_NODE) {
                continue;
            }

            var propertyName = node.tagName.split(':').pop();
            if (propertyName === this.options.geometryField) {
                continue;
            }

            var parseField = this.fields[propertyName];
            if (!parseField) {
                this.appendField(propertyName, "string");
                parseField = this.fields[propertyName];
            }

            properties[propertyName] = parseField(node.textContent);
        }

        return {
            type: 'Feature',
            properties: properties,
            id: feature.attributes['gml:id'].value
        };
    }
});

L.Format.GML = L.Format.Base.extend({

    includes: L.GML.ParserContainerMixin,

    initialize: function (options) {
        L.Format.Base.prototype.initialize.call(this, options);
        this.outputFormat = 'text/xml; subtype=gml/3.1.1';
        this.initializeParserContainer();
        this.appendParser(new L.GML.Point());
        this.appendParser(new L.GML.LineString());
        this.appendParser(new L.GML.Polygon());
        this.appendParser(new L.GML.MultiLineString());
        this.appendParser(new L.GML.MultiPolygon());
        this.appendParser(new L.GML.MultiCurve());
        this.appendParser(new L.GML.MultiSurface());
        this.appendParser(new L.GML.MultiPoint());
    },

    responseToLayers: function (rawData) {
        var layers = [];
        var xmlDoc = L.XmlUtil.parseXml(rawData);
        var featureCollection = xmlDoc.documentElement;
        var featureMemberNodes = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMember');
        for (var i = 0; i < featureMemberNodes.length; i++) {
            var feature = featureMemberNodes[i].firstChild;
            layers.push(this.processFeature(feature));
        }

        var featureMembersNode = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMembers');
        if (featureMembersNode.length > 0) {
            var features = featureMembersNode[0].childNodes;
            for (var j = 0; j < features.length; j++) {
                var node = features[j];
                if (node.nodeType === document.ELEMENT_NODE) {
                    layers.push(this.processFeature(node));
                }
            }
        }

        return layers;
    },

    processFeature: function (feature) {
        var layer = this.generateLayer(feature);
        layer.feature = this.featureType.parse(feature);
        return layer;
    },

    generateLayer: function (feature) {
        var geometryField = feature.getElementsByTagNameNS(this.namespaceUri, this.options.geometryField)[0];
        if (!geometryField) {
            throw new Error(
              'Geometry field \'' +
              this.options.geometryField +
              '\' doesn\' exist inside received feature: \'' +
              feature.innerHTML +
              '\'');
        }

        return this.parseElement(geometryField.firstChild, this.options);
    }
});

L.Util.project = function (crs, latlngs) {
    if (L.Util.isArray(latlngs)) {
        var result = [];
        latlngs.forEach(function (latlng) {
            result.push(L.Util.project(crs, latlng));
        });

        return result;
    }
    else {
        return crs.projection.project(latlngs);
    }
};

L.GmlUtil = {
    posNode: function (coord) {
        return L.XmlUtil.createElementNS('gml:pos', { srsDimension: 2 }, { value: coord.x + ' ' + coord.y });
    },

    posListNode: function (coords, close) {
        var localcoords = [];
        coords.forEach(function (coord) {
            localcoords.push(coord.x + ' ' + coord.y);
        });
        if (close && coords.length > 0) {
            var coord = coords[0];
            localcoords.push(coord.x + ' ' + coord.y);
        }

        var posList = localcoords.join(' ');
        return L.XmlUtil.createElementNS('gml:posList', {}, { value: posList });
    }
};

L.CircleMarker.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:Point', { srsName: crs.code });
        node.appendChild(L.GmlUtil.posNode(L.Util.project(crs, this.getLatLng())));
        return node;
    }
});

L.LatLngBounds.prototype.toGml = function (crs) {
    var projectedSW = crs.project(this.getSouthWest());
    var projectedNE = crs.project(this.getNorthEast());

    var envelopeElement = L.XmlUtil.createElementNS('gml:Envelope', { srsName: crs.code });
    envelopeElement.appendChild(L.XmlUtil.createElementNS('gml:lowerCorner', {}, { value: projectedSW.x + ' ' + projectedSW.y }));
    envelopeElement.appendChild(L.XmlUtil.createElementNS('gml:upperCorner', {}, { value: projectedNE.x + ' ' + projectedNE.y }));

    return envelopeElement;
};

L.Marker.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:Point', { srsName: crs.code });
        node.appendChild(L.GmlUtil.posNode(L.Util.project(crs, this.getLatLng())));
        return node;
    }
});

L.Polygon.include({
    toGml: function (crs) {
        var polygons = this.getLatLngs();
        var gmlPolygons = [];

        for (var i = 0; i < polygons.length; i++) {
            var polygonCoordinates = polygons[i];
            var flat = L.Polyline._flat(polygonCoordinates);
            var node = L.XmlUtil.createElementNS('gml:Polygon', { srsName: crs.code, srsDimension: 2 });
            node.appendChild(L.XmlUtil.createElementNS('gml:exterior'))
              .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', { srsDimension: 2 }))
              .appendChild(L.GmlUtil.posListNode(L.Util.project(crs, flat ? polygonCoordinates : polygonCoordinates[0]), true));

            if (!flat) {
                for (var hole = 1; hole < polygonCoordinates.length; hole++) {
                    node.appendChild(L.XmlUtil.createElementNS('gml:interior'))
                      .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', { srsDimension: 2 }))
                      .appendChild(L.GmlUtil.posListNode(L.Util.project(crs, polygonCoordinates[hole]), true));
                }
            }

            gmlPolygons.push(node);
        }

        if (gmlPolygons.length === 1) return gmlPolygons[0];

        // else make multipolygon
        var multi = L.XmlUtil.createElementNS('gml:MultiPolygon', { srsName: crs.code, srsDimension: 2 });
        var collection = multi.appendChild(L.XmlUtil.createElementNS('gml:polygonMembers'));
        for (var p = 0; p < gmlPolygons.length; p++) {
            collection.appendChild(gmlPolygons[p]);
        }

        return multi;
    }
});

L.Polyline.include({
    _lineStringNode: function (crs, latlngs) {
        var node = L.XmlUtil.createElementNS('gml:LineString', { srsName: crs.code, srsDimension: 2 });
        node.appendChild(L.GmlUtil.posListNode(L.Util.project(crs, latlngs), false));
        return node;
    },

    toGml: function (crs) {
        var latLngs = this.getLatLngs();
        if (L.Polyline._flat(latLngs)) return this._lineStringNode(crs, latLngs);

        //we have multiline
        var multi = L.XmlUtil.createElementNS('gml:MultiLineString', { srsName: crs.code, srsDimension: 2 });
        var collection = multi.appendChild(L.XmlUtil.createElementNS('gml:lineStringMembers'));
        for (var i = 0; i < latLngs.length; i++) {
            collection.appendChild(this._lineStringNode(crs, latLngs[i]));
        }

        return multi;
    }
});

var PropertiesMixin = {
    setProperties: function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                this.feature.properties[i] = obj[i];
            }
        }
    },
    getProperty: function (field) {
        return this.feature.properties[field];
    },
    deleteProperties: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (this.feature.properties.hasOwnProperty(arr[i])) {
                delete this.feature.properties[arr[i]];
            }
        }
    }
};
L.Marker.include(PropertiesMixin);
L.Path.include(PropertiesMixin);

//////////////////////////////////////////////////////



//wfs处理图层
L.WFSLayer = L.VirtualGrid.extend({
    options: {
        version: '1.1.0',
        namespaceUri: '',

        crs: L.CRS.EPSG4326,
        geometryField: 'Shape',
        url: '',
        typeNS: '',
        typeName: '',
        maxFeatures: 2000,
        filter: null,
        showExisting: true,

        opacity: 1,
        style: {
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        },
    },
    _capabilities: null,
    _boundingBox: null,
    state: {},
    initialize: function (options, readFormat) {
        L.VirtualGrid.prototype.initialize.call(this, options);
        L.Util.setOptions(this, options);

        this.options.crs = this.options.crs || L.CRS.EPSG4326;

        //
        var that = this;
        if (this.options.symbol && this.options.symbol.iconOptions) {//点图层
            this.options.pointToLayer = function (geojson, latlng) {
                var attr = geojson.properties;
                var markopt = L.mars.layer.getMarkerOptionsByConfig(that.options, attr);
                return L.marker(latlng, markopt);
            };
        }

        if (this.options.symbol && this.options.symbol.styleOptions) {//线面图层
            this.options.style = function (geojson) {
                var attr = geojson.properties;
                var styleOpt = L.mars.layer.getPolyOptionsByConfig(that.options, attr);
                return styleOpt;
            };
        }


        this._layers = {};
        this._cache = {};
        this._currentSnapshot = []; // cache of what layers should be active
        //this._activeRequests = 0;
        //======================
        this.state = {
            exist: 'exist'
        };

        this.readFormat = readFormat || new L.Format.GeoJSON({
            crs: this.options.crs,
            geometryField: this.options.geometryField
        });

        this.options.typeNSName = this.namespaceName(this.options.typeName); 
        this.options.srsName = this.options.crs.code;

        var that = this;
        this.describeFeatureType(function () {

        }, function (errorMessage) {
            that.fire('error', {
                error: new Error(errorMessage)
            });
        });
        //======================
    },

    onAdd: function (map) {
        //this._updateOpacity();
        for (var i in this._layers) {
            map.addLayer(this._layers[i]);
        }
        map.on('zoomend', this._handleZoomChange, this);
        return L.VirtualGrid.prototype.onAdd.call(this, map);
    },
    onRemove: function (map) {
        for (var i in this._layers) {
            map.removeLayer(this._layers[i]);
        }
        map.off('zoomend', this._handleZoomChange, this);
        return L.VirtualGrid.prototype.onRemove.call(this, map);
    },


    _cacheKey: function (coords) {
        return coords.z + ':' + coords.x + ':' + coords.y;
    },
    _visibleZoom: function () {
        // check to see whether the current zoom level of the map is within the optional limit defined for the FeatureLayer
        if (!this._map) {
            return false;
        }
        var zoom = this._map.getZoom();
        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            return false;
        } else { return true; }
    },
    createCell: function (bounds, coords) {
        if (this._visibleZoom() && this.options.showExisting) {
            var that = this;
            this.loadFeatures(this.options.filter, bounds, coords, function (error, layers) {
                if (error != null) {
                    console.log(error, '服务访问出错');
                    return;
                }

            });
        }
    },
    cellEnter: function (bounds, coords) {
        if (this._visibleZoom() && !this._zooming && this._map) {
            L.Util.requestAnimFrame(L.Util.bind(function () {
                var cacheKey = this._cacheKey(coords);
                var cellKey = this._cellCoordsToKey(coords);
                var layers = this._cache[cacheKey];
                if (this._activeCells[cellKey] && layers) {
                    this.addLayers(layers);
                }
            }, this));
        }
    },

    cellLeave: function (bounds, coords) {
        if (!this._zooming) {
            L.Util.requestAnimFrame(L.Util.bind(function () {
                if (this._map) {
                    var cacheKey = this._cacheKey(coords);
                    var cellKey = this._cellCoordsToKey(coords);
                    var layers = this._cache[cacheKey];
                    var mapBounds = this._map.getBounds();
                    if (!this._activeCells[cellKey] && layers) {
                        var removable = true;

                        for (var i = 0; i < layers.length; i++) {
                            var layer = this._layers[layers[i]];
                            if (layer && layer.getBounds && mapBounds.intersects(layer.getBounds())) {
                                removable = false;
                            }
                        }

                        if (removable) {
                            this.removeLayers(layers, !this.options.cacheLayers);
                        }

                        if (!this.options.cacheLayers && removable) {
                            delete this._cache[cacheKey];
                            delete this._cells[cellKey];
                            delete this._activeCells[cellKey];
                        }
                    }
                }
            }, this));
        }
    },

    _handleZoomChange: function () {
        if (!this._visibleZoom()) {
            this.removeLayers(this._currentSnapshot);
            this._currentSnapshot = [];
        } else {
            /*
            for every cell in this._activeCells
              1. Get the cache key for the coords of the cell
              2. If this._cache[key] exists it will be an array of feature IDs.
              3. Call this.addLayers(this._cache[key]) to instruct the feature layer to add the layers back.
            */
            for (var i in this._activeCells) {
                var coords = this._activeCells[i].coords;
                var key = this._cacheKey(coords);
                if (this._cache[key]) {
                    this.addLayers(this._cache[key]);
                }
            }
        }
    },

    namespaceName: function (name) {
        return this.options.typeNS + ':' + name;
    },
    setOpacity: function (opacity) {
        this.options.opacity = opacity;

        this._updateOpacity();

        return this;
    },
    _updateOpacity: function () {
        var style = L.extend(this.options.style || {}, {
            opacity: this.options.opacity,
            fillOpacity: this.options.opacity
        });

        //this.setStyle(style);
    },
    describeFeatureType: function (successCallback, errorCallback) {
        var requestData = L.XmlUtil.createElementNS('wfs:DescribeFeatureType', {
            service: 'WFS',
            version: this.options.version
        });
        requestData.appendChild(L.XmlUtil.createElementNS('TypeName', {}, {
            value: this.options.typeNSName
        }));

        var that = this;
        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.serializeXmlDocumentString(requestData),
            headers: this.options.headers || {},
            success: function (data) {
                // If some exception occur, WFS-service can response successfully, but with ExceptionReport,
                // and such situation must be handled.
                var exceptionReport = L.XmlUtil.parseOwsExceptionReport(data);
                if (exceptionReport) {
                    if (typeof (errorCallback) === 'function') {
                        errorCallback(exceptionReport.message);
                    }

                    return;
                }

                var xmldoc = L.XmlUtil.parseXml(data);
                var featureInfo = xmldoc.documentElement;
                that.readFormat.setFeatureDescription(featureInfo);
                that.options.namespaceUri = featureInfo.attributes.targetNamespace.value;
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            },
            error: function (errorMessage) {
                if (typeof (errorCallback) === 'function') {
                    errorCallback(errorMessage);
                }
            }
        });
    },
    bindGetFeature: function (filter, bounds) {
        var request = L.XmlUtil.createElementNS('wfs:GetFeature', {
            service: 'WFS',
            version: this.options.version,
            maxFeatures: this.options.maxFeatures,
            outputFormat: this.readFormat.outputFormat
        });

        var query = request.appendChild(L.XmlUtil.createElementNS('wfs:Query', {
            typeName: this.options.typeNSName,
            srsName: this.options.srsName
        }));

        if (filter) {
            query.appendChild(L.filter(filter));
        }
        if (bounds) {
            var filterBbox = new L.Filter.BBox(this.options.geometryField, bounds, L.CRS.EPSG4326);
            query.appendChild(L.filter(filterBbox));
        }

        return request;
    },

    query: function (filter, endfun) {
        this.loadFeatures(filter, null, null, endfun);
    },

    loadFeatures: function (filter, bounds, coords, endfun) {
        if (coords) {
            var key = this._cacheKey(coords);
            var _cache = this._cache[key];
            if (_cache && _cache.length > 0)
                return;
        }

        var that = this;
        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.serializeXmlDocumentString(that.bindGetFeature(filter, bounds)),
            headers: this.options.headers || {},
            success: function (responseText) {
                // If some exception occur, WFS-service can response successfully, but with ExceptionReport,
                // and such situation must be handled.
                var exceptionReport = L.XmlUtil.parseOwsExceptionReport(responseText);
                if (exceptionReport) {
                    that.fire('error', {
                        error: new Error(exceptionReport.message)
                    });

                    return that;
                }

                // Request was truly successful (without exception report),
                // so convert response to layers.
                var layers = that.readFormat.responseToLayers(responseText, {
                    coordsToLatLng: that.options.coordsToLatLng,
                    pointToLayer: that.options.pointToLayer,
                    style: that.options.style,
                });

                if (layers && layers.length > 0)
                    that._addFeatures(layers, coords);

                endfun(null, layers);
                return that;
            },
            error: function (errorMessage) {

                endfun(errorMessage, null);
                return that;
            }
        });
    },

    _addFeatures: function (layers, coords) {
        var key;
        if (coords) {
            key = this._cacheKey(coords);
            this._cache[key] = this._cache[key] || [];
        }

        for (var i = layers.length - 1; i >= 0; i--) {
            var id = layers[i].feature.id;
            if (coords) {
                if (this._currentSnapshot.indexOf(id) === -1) {
                    this._currentSnapshot.push(id);
                }
                if (this._cache[key].indexOf(id) === -1) {
                    this._cache[key].push(id);
                }
            }

            var layer = this._layers[id];
            var newLayer;

            if (this._visibleZoom() && layer && !this._map.hasLayer(layer)) {
                this._map.addLayer(layer);
            }

            //if (layer && this.options.simplifyFactor > 0 && (layer.setLatLngs || layer.setLatLng)) {
            //    this._updateLayer(layer, geojson);
            //}

            if (layer == null) {
                newLayer = layers[i];

                var arr = id.split(".");
                //if (arr.length == 2) {
                //    newLayer.feature.properties.id = arr[arr.length - 1];
                //}
                //else {
                //    newLayer.feature.properties.id = id;
                //}


                // bubble events from individual layers to the feature layer
                newLayer.addEventParent(this);

                if (this.options.onEachFeature) {
                    this.options.onEachFeature(newLayer.feature, newLayer);
                }

                // cache the layer
                this._layers[id] = newLayer;

                // style the layer
                this.setFeatureStyle(id, this.options.style);

                //绑定popup
                var cfg = this.options;
                if (this.options.popup || this.options.columns) {
                    newLayer.bindPopup(function (evt) {
                        var attr = evt.feature.properties;

                        var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;
                        return L.mars.layer.getPopup(cfg.popup || cfg.columns, attr, _title);

                    }, { maxWidth: 600 });
                }
                //绑定tooltip
                if (this.options.tooltip) {
                    newLayer.bindTooltip(function (evt) {
                        var attr = evt.feature.properties;

                        var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;
                        return L.mars.layer.getPopup(cfg.tooltip, attr, _title);
                    }, { className: 'leafletlayer-tooltip', direction: 'top' });
                }

                // add the layer if the current zoom level is inside the range defined for the layer, it is within the current time bounds or our layer is not time enabled
                if (this._visibleZoom()) {
                    this._map.addLayer(newLayer);
                }
            }
            else {
                layers[i] = layer;
            }


        }

    },

    eachFeature: function (method, context) {
        for (var i in this._layers) {
            method.call(context, this._layers[i]);
        }
        return this;
    },

    setStyle: function (style) {
        this.options.style = style;
        this.eachFeature(function (layer) {
            this.setFeatureStyle(layer.feature.id, style);
        }, this);
        return this;
    },

    setFeatureStyle: function (id, style) {
        var layer = this._layers[id];
        if (typeof style === 'function') {
            style = style(layer.feature);
        }
        if (layer.setStyle) {
            layer.setStyle(style);
        }
        return this;
    },

    addLayers: function (ids) {
        for (var i = ids.length - 1; i >= 0; i--) {
            var layer = this._layers[ids[i]];
            if (layer) {
                this._map.addLayer(layer);
            }
        }
    },

    removeLayers: function (ids, permanent) {
        for (var i = ids.length - 1; i >= 0; i--) {
            var id = ids[i];
            var layer = this._layers[id];
            if (layer) {
                this._map.removeLayer(layer);
            }
            if (layer && permanent) {
                delete this._layers[id];
            }
        }
    },
    getFeature: function (id) {
        return this._layers[id];
    },

    bringToBack: function () {
        this.eachFeature(function (layer) {
            if (layer.bringToBack) {
                layer.bringToBack();
            }
        });
    },

    bringToFront: function () {
        this.eachFeature(function (layer) {
            if (layer.bringToFront) {
                layer.bringToFront();
            }
        });
    },


});


L.wfsLayer = function (options) {
    return new L.WFSLayer(options);
}