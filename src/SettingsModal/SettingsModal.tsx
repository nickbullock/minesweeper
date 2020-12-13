import Modal from 'react-modal';
import React, { FC } from 'react';

import { Form, FormProps } from './Form/Form';

export interface SettingsModalProps extends Modal.Props, FormProps {}

export const SettingsModal: FC<SettingsModalProps> = props => {
  const {
    level,
    isOpen,
    onRequestClose,
    onSubmit,
    rowCount: defaultRowCount,
    columnCount: defaultColumnCount,
    mineCount: defaultMineCount,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      className="modal"
      overlayClassName="modal-overlay"
      onRequestClose={onRequestClose}
    >
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Settings</div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" onClick={onRequestClose} />
          </div>
        </div>
        <div className="window-body">
          <Form
            level={level}
            rowCount={defaultRowCount}
            columnCount={defaultColumnCount}
            mineCount={defaultMineCount}
            onSubmit={onSubmit}
            onCancel={onRequestClose}
          />
        </div>
      </div>
    </Modal>
  );
};
