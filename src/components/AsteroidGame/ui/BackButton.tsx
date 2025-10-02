import React from 'react';
import './BackButton.css';

interface BackButtonProps {
    onBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
    return (
        <button
            className="back-button"
            onClick={onBack}
        >
            ← Назад
        </button>
    );
};