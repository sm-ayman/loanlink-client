import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import Dropdown from '../components/ui/Dropdown';
import { FaSearch, FaUser, FaEllipsisV, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

const DesignSystemShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for Table
  const tableHeaders = ['Borrower', 'Loan Type', 'Amount', 'Term', 'Status'];
  const tableData = [
    { name: 'Sarah Jenkins', type: 'Personal Loan', amount: '$5,000', term: '12 Months', status: 'Approved' },
    { name: 'Marcus Sterling', type: 'Business Expansion', amount: '$25,000', term: '36 Months', status: 'Pending' },
    { name: 'Diana Prince', type: 'Microloan', amount: '$800', term: '6 Months', status: 'Repaid' },
  ];

  const renderTableRow = (item, index) => {
    const statusVariants = {
      Approved: 'success',
      Pending: 'warning',
      Repaid: 'primary',
    };

    return (
      <tr key={index} className="hover:bg-brand-neutral/20 transition-colors duration-150 border-b border-brand-border/60">
        <td className="px-6 py-4 font-semibold text-brand-text">{item.name}</td>
        <td className="px-6 py-4 text-brand-text-muted">{item.type}</td>
        <td className="px-6 py-4 font-bold text-brand-secondary">{item.amount}</td>
        <td className="px-6 py-4 text-brand-text-muted">{item.term}</td>
        <td className="px-6 py-4">
          <Badge variant={statusVariants[item.status]} dot>
            {item.status}
          </Badge>
        </td>
      </tr>
    );
  };

  // Dropdown options
  const dropdownItems = [
    { label: 'Edit Profile', icon: FaEdit, onClick: () => alert('Edit profile clicked!') },
    { label: 'Mark as Verified', icon: FaCheck, onClick: () => alert('Verified clicked!') },
    { divider: true },
    { label: 'Delete Account', icon: FaTrash, danger: true, onClick: () => alert('Delete account clicked!') },
  ];

  return (
    <div className="container mx-auto px-4 py-24 space-y-12">
      {/* Title */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <Badge variant="primary">Design System</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Microloan UI Components
        </h1>
        <p className="text-base text-brand-text-muted">
          A showcase of our premium, accessible, and responsive components built specifically on a unified border radius and HSL-mapped color schemes.
        </p>
      </div>

      {/* Buttons Showcase */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-brand-border pb-2 text-brand-text">
          1. Buttons & Interaction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Button Variants" subtitle="Standard buttons for varying weight and hierarchy.">
            <div className="flex flex-wrap gap-3 mt-4">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Info</Button>
              <Button variant="accent">Accent Alert</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </Card>
          
          <Card title="Button States & Sizes" subtitle="Showing loaders, disabled, and sized instances.">
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large Size</Button>
              <Button isLoading={isLoading} onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}>
                Click to Load
              </Button>
              <Button disabled>Disabled Button</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Input Fields Showcase */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-brand-border pb-2 text-brand-text">
          2. Inputs & Forms
        </h2>
        <Card title="Form Inputs" subtitle="Standard input variants, containing labels, descriptions, and icon configurations.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Input
              label="Standard Text Input"
              placeholder="Type your name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Required for processing microloans."
            />
            <Input
              label="Input with Left Icon"
              placeholder="Search loans..."
              icon={FaSearch}
              iconPosition="left"
            />
            <Input
              label="Password Input"
              type="password"
              placeholder="Enter secured password"
              icon={FaUser}
              iconPosition="right"
              error="Password must contain at least 8 characters"
            />
          </div>
        </Card>
      </section>

      {/* Cards & Badges Showcase */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-brand-border pb-2 text-brand-text">
          3. Cards & Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Standard Card" subtitle="Default layout container." hoverable>
            <p className="text-brand-text-muted">
              This card supports hovering animations and transitions. Moving cursor over this card shifts its position slightly.
            </p>
          </Card>

          <Card title="Badges Showcase" subtitle="Compact labels denoting status or categorization.">
            <div className="flex flex-wrap gap-2.5 mt-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success" dot>Success Dot</Badge>
              <Badge variant="warning" dot>Warning</Badge>
              <Badge variant="error" dot>Error</Badge>
              <Badge variant="neutral">Neutral Info</Badge>
            </div>
          </Card>

          <Card 
            title="Dropdown Menu" 
            subtitle="Trigger components mapping menu items."
            action={
              <Dropdown
                trigger={
                  <Button variant="outline" size="sm" className="px-2">
                    <FaEllipsisV />
                  </Button>
                }
                items={dropdownItems}
              />
            }
          >
            <p className="text-brand-text-muted">
              Click the triple dots in the top right corner of this card to reveal the interactive actions drop-down popup.
            </p>
          </Card>
        </div>
      </section>

      {/* Tables Showcase */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-brand-border pb-2 text-brand-text">
          4. Tables & Data List
        </h2>
        <div className="space-y-4">
          <Table
            headers={tableHeaders}
            data={tableData}
            renderRow={renderTableRow}
          />
        </div>
      </section>

      {/* Modals Showcase */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-brand-border pb-2 text-brand-text">
          5. Overlay Modals
        </h2>
        <Card title="Modals & Dialogs" subtitle="Overlay windows displaying high priority alerts.">
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Open Interactive Modal
            </Button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Loan Details"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                  alert('Loan processed!');
                  setIsModalOpen(false);
                }}>
                  Proceed & Apply
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              <p>You are about to apply for a microloan package. Please verify key items:</p>
              <div className="bg-brand-neutral p-4 rounded-brand border border-brand-border space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-text-muted">LOAN SCHEME</span>
                  <span className="text-brand-text">Personal Emergency Loan</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-text-muted">INTEREST RATE</span>
                  <span className="text-brand-text">5.4% Flat Annual</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-text-muted">COLLATERAL REQUIREMENT</span>
                  <span className="text-brand-text text-brand-accent">None</span>
                </div>
              </div>
            </div>
          </Modal>
        </Card>
      </section>
    </div>
  );
};

export default DesignSystemShowcase;
