"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface InteractiveMapProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  onGeoJsonChange: (geoJson: GeoJSON.FeatureCollection | null) => void;
  initialAddress?: string;
}

export function InteractiveMap({
  onAddressSelect,
  onGeoJsonChange,
  initialAddress = "",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const drawnItemsRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadMap = async () => {
      const L = (await import("leaflet")).default;
      await import("@geoman-io/leaflet-geoman-free");

      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize map centered on Spain
      const map = L.map(mapRef.current).setView([40.4168, -3.7038], 6);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Initialize feature group for drawn items
      const drawnItems = L.featureGroup().addTo(map);
      drawnItemsRef.current = drawnItems;

      // Add Geoman controls - ONLY POLYGON
      map.pm.addControls({
        position: "topright",
        drawCircle: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawPolygon: true,
        drawMarker: false,
        editMode: true,
        dragMode: false,
        cutPolygon: false,
        removalMode: true,
      });

      // Customize toolbar text
      map.pm.Toolbar.changeActionsOfControl("drawPolygon", [
        { text: "Dibuja tu zona" },
      ]);

      // Handle shape creation
      map.on("pm:create", (e: any) => {
        // Remove previous polygons (only allow one)
        drawnItems.clearLayers();
        const layer = e.layer;
        drawnItems.addLayer(layer);
        updateGeoJson();
      });

      // Handle shape edit
      map.on("pm:edit", () => {
        updateGeoJson();
      });

      // Handle shape removal
      map.on("pm:remove", () => {
        updateGeoJson();
      });

      const updateGeoJson = () => {
        if (!drawnItemsRef.current) return;

        const layers = drawnItemsRef.current.getLayers();
        if (layers.length === 0) {
          onGeoJsonChange(null);
          return;
        }

        const features = layers.map((layer: any) => {
          return layer.toGeoJSON();
        });

        const featureCollection: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: features,
        };

        onGeoJsonChange(featureCollection);
      };

      mapInstanceRef.current = map;
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onGeoJsonChange]);

  // Search for addresses using Nominatim
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=5&countrycodes=es`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error searching address:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    onAddressSelect(suggestion.display_name, lat, lng);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--brand-dark)]/75">
        <MapPin className="h-4 w-4" />
        <span>Ubicación y zona</span>
      </div>

      {/* Address search */}
      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-dark)]/40" />
          <input
            type="text"
            className="input pl-10 pr-10"
            placeholder="Buscar dirección... (ej: Calle Mayor, Madrid)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-dark)]/40 hover:text-[var(--brand-dark)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl border border-[rgba(0,1,34,0.12)] bg-white shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-[var(--brand-muted)]/30 transition-colors border-b border-[rgba(0,1,34,0.06)] last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-[var(--brand-dark)]/50 flex-shrink-0" />
                  <span className="text-sm text-[var(--brand-dark)]">
                    {suggestion.display_name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <p className="mt-2 text-xs text-[var(--brand-dark)]/55">
            Buscando...
          </p>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="h-[450px] w-full rounded-2xl border border-[rgba(0,1,34,0.12)] overflow-hidden shadow-md"
      />

      <div className="rounded-2xl border border-[rgba(159,179,216,0.35)] bg-[var(--brand-accent)]/10 p-3 text-xs text-[var(--brand-dark)]/70">
        <strong>Cómo usar el mapa:</strong>
        <ol className="mt-2 space-y-1 ml-4 list-decimal">
          <li>Busca y selecciona tu dirección en el buscador</li>
          <li>Usa el botón de polígono (esquina superior derecha) para dibujar tu zona</li>
          <li>Haz clic en múltiples puntos para crear el área</li>
          <li>Cierra el polígono haciendo clic en el primer punto</li>
          <li>Puedes editar los puntos o eliminar el polígono para rehacerlo</li>
        </ol>
      </div>
    </div>
  );
}
