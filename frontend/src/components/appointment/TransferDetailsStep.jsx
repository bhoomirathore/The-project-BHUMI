import React from 'react';
import { Landmark, Users } from 'lucide-react';
import PropertyStep from './PropertyStep';
import BuyerStep from './BuyerStep';

export default function TransferDetailsStep({
  properties = [],
  selectedPropertyId,
  onSelectProperty,
  buyerQuery,
  onChangeBuyerQuery,
  onSearchBuyer,
  buyerSearching,
  buyerResult,
  buyerError,
  error,
}) {
  return (
    <div className="space-y-8">
      {/* Part 1: Select Property */}
      <div>
        <PropertyStep
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={onSelectProperty}
        />
      </div>

      <div className="border-t border-border/80 pt-6">
        {/* Part 2: Buyer Identification */}
        <BuyerStep
          buyerQuery={buyerQuery}
          onChangeBuyerQuery={onChangeBuyerQuery}
          onSearchBuyer={onSearchBuyer}
          buyerSearching={buyerSearching}
          buyerResult={buyerResult}
          buyerError={buyerError}
        />
      </div>

      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
