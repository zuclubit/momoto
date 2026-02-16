/**
 * @fileoverview Opportunities Management Page
 *
 * FASE 16: Topocho CRM Demo
 *
 * Opportunity list with filtering and pipeline management.
 *
 * @module apps/topocho-crm/pages/Opportunities
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardVariant } from '../../../adapters/react/card';
import { Stat } from '../../../adapters/react/stat';
import { Badge, BadgeVariant } from '../../../adapters/react/badge';
import { Button } from '../../../adapters/react/button';
import { TextField } from '../../../adapters/react/textfield';
import { Select } from '../../../adapters/react/select';
import type { SelectOption } from '../../../adapters/core/select';
import type { Opportunity, OpportunityStage } from '../state/types';
import {
  neutralBg,
  neutralText,
  neutralBorder,
  neutralHoverBg,
  primaryBg,
  primaryText,
  primaryHoverBg,
  successBg,
  successText,
  warningBg,
  warningText,
  fieldBg,
  fieldText,
  fieldBorder,
  fieldPlaceholder,
  fieldHoverBorder,
  fieldFocusBorder,
  fieldFocusOutline,
  labelText,
  helperText,
  dropdownBg,
  dropdownBorder,
  dropdownShadow,
  optionText,
  optionHoverBg,
  optionSelectedBg,
} from '../tokens/mockTokens';
import {
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  formatNumber,
} from '../tokens/designTokens';

// ============================================================================
// TYPES
// ============================================================================

interface OpportunitiesProps {
  opportunities: Opportunity[];
  onUpdateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  stageFilter: OpportunityStage | 'all';
  onStageFilterChange: (stage: OpportunityStage | 'all') => void;
  totalValue: number;
  weightedValue: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Opportunities({
  opportunities,
  onUpdateOpportunity,
  stageFilter,
  onStageFilterChange,
  totalValue,
  weightedValue,
}: OpportunitiesProps) {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formProbability, setFormProbability] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStage, setFormStage] = useState<SelectOption<OpportunityStage> | null>(null);

  // Filter options
  const stageOptions: SelectOption<OpportunityStage | 'all'>[] = [
    { value: 'all', label: 'All Stages' },
    { value: 'lead', label: 'Lead' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  const editStageOptions: SelectOption<OpportunityStage>[] = [
    { value: 'lead', label: 'Lead' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  const handleEditOpportunity = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setIsEditing(true);
    setFormTitle(opp.title);
    setFormValue(opp.value.toString());
    setFormProbability(opp.probability.toString());
    setFormNotes(opp.notes);
    setFormStage(editStageOptions.find((opt) => opt.value === opp.stage) || null);
  };

  const handleCancelEdit = () => {
    setSelectedOpp(null);
    setIsEditing(false);
    setFormTitle('');
    setFormValue('');
    setFormProbability('');
    setFormNotes('');
    setFormStage(null);
  };

  const handleSaveOpportunity = () => {
    if (selectedOpp && formStage) {
      onUpdateOpportunity(selectedOpp.id, {
        title: formTitle,
        value: parseFloat(formValue) || 0,
        probability: parseInt(formProbability) || 0,
        notes: formNotes,
        stage: formStage.value,
      });
      handleCancelEdit();
    }
  };

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case 'won':
        return { bg: successBg.value.hex, text: successText.value.hex };
      case 'lost':
        return { bg: neutralBorder.value.hex, text: neutralText.value.hex };
      case 'negotiation':
        return { bg: warningBg.value.hex, text: warningText.value.hex };
      default:
        return { bg: primaryBg.value.hex, text: primaryText.value.hex };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Page Title */}
      <div>
        <h1
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            lineHeight: typography.lineHeight.tight,
            margin: 0,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          Opportunities
        </h1>
        <p
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize.sm,
            lineHeight: typography.lineHeight.relaxed,
            margin: `${spacing[2]} 0 0 0`,
            opacity: 0.6,
          }}
        >
          Track your sales pipeline
        </p>
      </div>

      {/* Value Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[6] }}>
        <Card variant={CardVariant.INTERACTIVE}>
          <Stat
            label="Total Pipeline Value"
            value={formatNumber(totalValue)}
            helperText="Sum of all opportunities"
            size="xl"
            labelColor={neutralText}
            valueColor={neutralText}
            helperTextColor={neutralText}
          />
        </Card>

        <Card variant={CardVariant.INTERACTIVE}>
          <Stat
            label="Weighted Value"
            value={formatNumber(Math.round(weightedValue))}
            helperText="Probability-weighted forecast"
            size="xl"
            labelColor={neutralText}
            valueColor={neutralText}
            helperTextColor={neutralText}
          />
        </Card>
      </div>

      {/* Stage Filter */}
      <Card variant={CardVariant.ELEVATED}>
        <div style={{ maxWidth: '320px' }}>
          <Select
            options={stageOptions}
            value={stageOptions.find((opt) => opt.value === stageFilter) || null}
            onChange={(opt) => opt && onStageFilterChange(opt.value)}
            label="Stage Filter"
            placeholder="All Stages"
            backgroundColor={fieldBg}
            textColor={fieldText}
            borderColor={fieldBorder}
            hoverBorderColor={fieldHoverBorder}
            focusBorderColor={fieldFocusBorder}
            focusOutlineColor={fieldFocusOutline}
            dropdownBackgroundColor={dropdownBg}
            dropdownBorderColor={dropdownBorder}
            dropdownShadowColor={dropdownShadow}
            optionTextColor={optionText}
            optionHoverBackgroundColor={optionHoverBg}
            optionSelectedBackgroundColor={optionSelectedBg}
            size="md"
          />
        </div>
      </Card>

      {/* Opportunity List */}
      <Card variant={CardVariant.ELEVATED} style={{ overflow: 'hidden', padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
            padding: `${spacing[4]} ${spacing[6]}`,
            borderBottom: `1px solid ${neutralBorder.value.hex}`,
            fontWeight: typography.fontWeight.semibold,
            color: neutralText.value.hex,
            fontSize: typography.fontSize.sm,
            backgroundColor: neutralBg.value.hex,
          }}
        >
          <div>Title</div>
          <div>Client</div>
          <div>Value</div>
          <div>Probability</div>
          <div>Stage</div>
          <div>Actions</div>
        </div>

        {opportunities.map((opp) => {
          const stageColors = getStageColor(opp.stage);
          return (
            <div
              key={opp.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
                padding: `${spacing[4]} ${spacing[6]}`,
                borderBottom: `1px solid ${neutralBorder.value.hex}`,
                color: neutralText.value.hex,
                fontSize: typography.fontSize.sm,
                backgroundColor:
                  selectedOpp?.id === opp.id ? neutralHoverBg.value.hex : 'transparent',
                transition: transitions.base,
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                if (selectedOpp?.id !== opp.id) {
                  e.currentTarget.style.backgroundColor = neutralBg.value.hex;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOpp?.id !== opp.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ fontWeight: typography.fontWeight.medium }}>{opp.title}</div>
              <div style={{ opacity: 0.7 }}>{opp.clientName}</div>
              <div style={{ fontWeight: typography.fontWeight.semibold }}>
                ${opp.value.toLocaleString()}
              </div>
              <div style={{ opacity: 0.7 }}>{opp.probability}%</div>
              <div>
                <Badge
                  variant={BadgeVariant.SOLID}
                  size="sm"
                  backgroundColor={{ value: { hex: stageColors.bg } } as any}
                  textColor={{ value: { hex: stageColors.text } } as any}
                >
                  {opp.stage}
                </Badge>
              </div>
              <div>
                <Button
                  label="Edit"
                  backgroundColor={primaryBg}
                  textColor={primaryText}
                  hoverBackgroundColor={primaryHoverBg}
                  onClick={() => handleEditOpportunity(opp)}
                  size="sm"
                />
              </div>
            </div>
          );
        })}

        {opportunities.length === 0 && (
          <div
            style={{
              padding: `${spacing[12]} ${spacing[6]}`,
              textAlign: 'center',
              color: neutralText.value.hex,
              fontSize: typography.fontSize.sm,
              opacity: 0.5,
            }}
          >
            No opportunities found
          </div>
        )}
      </Card>

      {/* Edit Form */}
      {isEditing && selectedOpp && (
        <Card variant={CardVariant.ELEVATED}>
          <h2
            style={{
              color: neutralText.value.hex,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              lineHeight: typography.lineHeight.tight,
              margin: `0 0 ${spacing[6]} 0`,
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            Edit Opportunity
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            <TextField
              value={formTitle}
              onChange={setFormTitle}
              label="Title"
              required
              backgroundColor={fieldBg}
              textColor={fieldText}
              borderColor={fieldBorder}
              placeholderColor={fieldPlaceholder}
              hoverBorderColor={fieldHoverBorder}
              focusBorderColor={fieldFocusBorder}
              focusOutlineColor={fieldFocusOutline}
              labelColor={labelText}
              helperTextColor={helperText}
              size="md"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[4] }}>
              <TextField
                value={formValue}
                onChange={setFormValue}
                label="Value ($)"
                required
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                placeholderColor={fieldPlaceholder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                labelColor={labelText}
                helperTextColor={helperText}
                size="md"
              />

              <TextField
                value={formProbability}
                onChange={setFormProbability}
                label="Probability (%)"
                required
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                placeholderColor={fieldPlaceholder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                labelColor={labelText}
                helperTextColor={helperText}
                size="md"
              />

              <Select
                options={editStageOptions}
                value={formStage}
                onChange={setFormStage}
                label="Stage"
                placeholder="Select stage..."
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                dropdownBackgroundColor={dropdownBg}
                dropdownBorderColor={dropdownBorder}
                dropdownShadowColor={dropdownShadow}
                optionTextColor={optionText}
                optionHoverBackgroundColor={optionHoverBg}
                optionSelectedBackgroundColor={optionSelectedBg}
                size="md"
              />
            </div>

            <TextField
              value={formNotes}
              onChange={setFormNotes}
              label="Notes"
              helperText="Additional details about this opportunity"
              backgroundColor={fieldBg}
              textColor={fieldText}
              borderColor={fieldBorder}
              placeholderColor={fieldPlaceholder}
              hoverBorderColor={fieldHoverBorder}
              focusBorderColor={fieldFocusBorder}
              focusOutlineColor={fieldFocusOutline}
              labelColor={labelText}
              helperTextColor={helperText}
              size="md"
            />

            <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[2] }}>
              <Button
                label="Save Changes"
                backgroundColor={primaryBg}
                textColor={primaryText}
                hoverBackgroundColor={primaryHoverBg}
                onClick={handleSaveOpportunity}
                size="md"
              />

              <Button
                label="Cancel"
                backgroundColor={neutralBg}
                textColor={neutralText}
                hoverBackgroundColor={neutralHoverBg}
                onClick={handleCancelEdit}
                size="md"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
