'use client';

import { useState } from 'react';
import Button from '@/components/materials/form/Button';
import ConfirmDialog from '@/components/materials/modal/ConfirmDialog';

export default function DeleteProjectClient({ id, name }: { id: string, name: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/project/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      setShowConfirm(false);
      // Refresh the page to update the list
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="small"
        onClick={() => setShowConfirm(true)}
        className="text-xs px-2 py-1"
      >
        Delete
      </Button>

      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        title="Delete Project?"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </>
  );
}
