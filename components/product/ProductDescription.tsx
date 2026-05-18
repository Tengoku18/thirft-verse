import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import React from "react";

interface Props {
  description: string;
}

export function ProductDescription({ description }: Props) {
  return (
    <Card variant="outlined">
      <Typography variation="h5" className="text-brand-espresso mb-2">
        Description
      </Typography>
      <Typography
        variation="body-sm"
        className="text-ui-secondary leading-relaxed"
      >
        {description}
      </Typography>
    </Card>
  );
}
