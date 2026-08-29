from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import shape, mapping, Polygon, Point
from shapely.ops import transform
import pyproj
from typing import Dict, Any, Tuple

# Reusable PostGIS / Shapely utilities

def geojson_to_geometry(geojson_dict: Dict[str, Any]):
    """Converts a GeoJSON geometry dict to Shapely geometry."""
    geom = shape(geojson_dict)
    return from_shape(geom, srid=4326)

def geometry_to_geojson(db_geometry) -> Dict[str, Any]:
    """Converts a GeoAlchemy2 geometry object to GeoJSON dict."""
    shapely_geom = to_shape(db_geometry)
    return mapping(shapely_geom)

def calculate_polygon_area_acres(shapely_polygon: Polygon) -> float:
    """Calculates polygon area in acres using equal area projection (UTM / WGS84 EPSG:3857)."""
    wgs84 = pyproj.CRS("EPSG:4326")
    utm = pyproj.CRS("EPSG:3857") # Web Mercator
    project = pyproj.Transformer.from_crs(wgs84, utm, always_xy=True).transform
    projected_polygon = transform(project, shapely_polygon)
    
    # Area in square meters -> convert to acres (1 acre = 4046.86 sq meters)
    area_sq_m = projected_polygon.area
    return round(area_sq_m / 4046.86, 2)

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance between two lat/lon coordinates in kilometers."""
    p1 = Point(lon1, lat1)
    p2 = Point(lon2, lat2)
    
    geod = pyproj.Geod(ellps="WGS84")
    _, _, distance_m = geod.inv(p1.x, p1.y, p2.x, p2.y)
    return round(distance_m / 1000.0, 2)
