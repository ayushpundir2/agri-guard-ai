import math
from typing import Dict, Any, Tuple
from shapely.geometry import shape, mapping, Polygon, Point
from geoalchemy2.shape import to_shape, from_shape

# Reusable PostGIS / Shapely utilities (self-contained, no PROJ file dependencies)

def geojson_to_geometry(geojson_dict: Dict[str, Any]):
    """Converts a GeoJSON geometry dict to Shapely geometry."""
    geom = shape(geojson_dict)
    return from_shape(geom, srid=4326)

def geometry_to_geojson(db_geometry) -> Dict[str, Any]:
    """Converts a GeoAlchemy2 geometry object to GeoJSON dict."""
    shapely_geom = to_shape(db_geometry)
    return mapping(shapely_geom)

def calculate_polygon_area_acres(shapely_polygon: Polygon) -> float:
    """Calculates approximate polygon area in acres for Pune region (18.5° N)."""
    try:
        centroid = shapely_polygon.centroid
        lat_rad = math.radians(centroid.y)
        
        # Meters per degree at centroid latitude
        meters_per_deg_lat = 111000.0
        meters_per_deg_lon = 111000.0 * math.cos(lat_rad)
        
        # Scale polygon coordinates to meters
        sq_deg = shapely_polygon.area
        sq_meters = sq_deg * meters_per_deg_lat * meters_per_deg_lon
        
        # 1 acre = 4046.86 sq meters
        area_acres = round(sq_meters / 4046.86, 2)
        return max(0.5, area_acres)
    except Exception:
        return 2.5 # Default reasonable farm acreage fallback

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance between two lat/lon coordinates in km using Haversine formula."""
    try:
        r = 6371.0 # Earth's mean radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat / 2.0) ** 2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * (math.sin(dlon / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(r * c, 2)
    except Exception:
        return 10.0
