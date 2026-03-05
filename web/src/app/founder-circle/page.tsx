'use client';

import {
  ApplicationFormStep,
  BenefitsStep,
  FounderCircleNavbar,
  GlowBackground,
  RoleSelectionStep,
  SuccessStep,
} from '@/_components/founder-circle';
import { useState } from 'react';

type Role = 'creator' | 'seller';
type Step = 'role' | 'benefits' | 'form' | 'success';

export default function FounderCirclePage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);

  const handleRoleSelect = (selected: Role) => {
    setRole(selected);
    setStep('benefits');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#140E09' }}>
      <GlowBackground />
      <FounderCircleNavbar />

      {step === 'role' && <RoleSelectionStep onSelect={handleRoleSelect} />}

      {step === 'benefits' && role && (
        <BenefitsStep
          role={role}
          onBack={() => setStep('role')}
          onContinue={() => setStep('form')}
        />
      )}

      {step === 'form' && role && (
        <ApplicationFormStep
          role={role}
          onBack={() => setStep('benefits')}
          onSuccess={() => setStep('success')}
        />
      )}

      {step === 'success' && <SuccessStep />}
    </div>
  );
}
