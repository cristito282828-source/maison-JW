'use client';

import { useState } from 'react';
import type { WooProductAttribute, WooProductVariation } from '@/lib/woocommerce/types';

type ProductVariation = WooProductVariation & {
  databaseId?: number;
  attributes: {
    nodes: WooProductAttribute[];
  };
};

type ProductAttribute = WooProductAttribute & {
  options?: string[];
};

interface ProductVariationsProps {
  variations: ProductVariation[];
  attributes?: ProductAttribute[];
  defaultPrice: string;
  onVariationChange: (variation: ProductVariation | null, selectedValues?: Record<string, string>) => void;
}

export function ProductVariations({ variations, attributes, defaultPrice, onVariationChange }: ProductVariationsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<ProductVariation | null>(null);

  // Extraer atributos únicos del producto (no de las variaciones)
  // WooCommerce puede enviar los valores en `options` del atributo
  const getUniqueAttributes = () => {
    const attributeMap: Record<string, Set<string>> = {};

    // Primero, buscar en los atributos del producto (donde options está disponible)
    if (attributes && attributes.length > 0) {
      attributes.forEach((attr) => {
        if (!attr.name) return;

        if (attr.options && attr.options.length > 0) {
          // Usar options del atributo
          attributeMap[attr.name] = new Set(attr.options);
        } else if (attr.value) {
          // Fallback a value
          attributeMap[attr.name] = new Set([attr.value]);
        }
      });
    }

    // Si no hay atributos, buscar en las variaciones
    if (Object.keys(attributeMap).length === 0) {
      variations.forEach((variation) => {
        variation.attributes.nodes.forEach((attr) => {
          if (!attr.name) return;

          if (attr.value) {
            if (!attributeMap[attr.name]) {
              attributeMap[attr.name] = new Set();
            }
            attributeMap[attr.name]!.add(attr.value);
          }

          if (attr.options && attr.options.length > 0) {
            if (!attributeMap[attr.name]) {
              attributeMap[attr.name] = new Set();
            }
            attr.options.forEach(opt => attributeMap[attr.name]!.add(opt));
          }
        });
      });
    }

    return Object.entries(attributeMap).map(([name, values]) => ({
      name,
      values: Array.from(values).sort()
    }));
  };

  const attributesList = getUniqueAttributes();

  // Encontrar variación que coincide con los atributos seleccionados
  const findMatchingVariation = () => {
    if (Object.keys(selectedAttributes).length === 0) {
      return null;
    }

    return variations.find((variation) => {
      const attrs = variation.attributes.nodes;
      const matches = attrs.every(
        (attr) => attr.value && selectedAttributes[attr.name] === attr.value
      );
      return matches;
    });
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelection = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newSelection);

    // Buscar variación que coincida
    let matchingVariation = variations.find((variation) => {
      const attrs = variation.attributes.nodes;
      const matches = Object.entries(newSelection).every(([name, selectedValue]) => {
        return attrs.some((attr) => {
          const nameMatches = attr.name === name;
          const valueMatches = attr.value && attr.value === selectedValue;
          const emptyButMatches = !attr.value;
          return nameMatches && (valueMatches || emptyButMatches);
        });
      });
      return matches;
    });

    // Si no se encontró, tomar la primera variación disponible
    if (!matchingVariation && variations.length > 0) {
      matchingVariation = variations[0];
    }

    if (matchingVariation) {
      setCurrentVariation(matchingVariation);
      onVariationChange(matchingVariation, newSelection);
    } else {
      setCurrentVariation(null);
      onVariationChange(null, newSelection);
    }
  };

  // Verificar si una combinación está disponible
  const isValueAvailable = (attributeName: string, value: string) => {
    const otherSelections = Object.entries(selectedAttributes).filter(([name]) => name !== attributeName);

    if (otherSelections.length === 0) {
      return true;
    }

    return variations.some((variation) => {
      const hasThisValue = variation.attributes.nodes.some(
        (attr) => attr.name === attributeName && attr.value === value
      );

      const matchesOtherSelections = otherSelections.every(([name, selectedValue]) =>
        variation.attributes.nodes.some(
          (attr) => attr.name === name && attr.value === selectedValue
        )
      );

      return hasThisValue && matchesOtherSelections;
    });
  };

  if (attributesList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {attributesList.map((attr) => (
        <div key={attr.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {attr.name === 'pa_tamano' ? 'Tamaño' : attr.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {attr.values.map((value) => {
              const isSelected = selectedAttributes[attr.name] === value;
              const isAvailable = isValueAvailable(attr.name, value);

              return (
                <button
                  key={value}
                  onClick={() => handleAttributeChange(attr.name, value)}
                  disabled={!isAvailable && !isSelected}
                  className={`px-4 py-2 border-2 rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-green-700 bg-green-700 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-700'
                  } ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
