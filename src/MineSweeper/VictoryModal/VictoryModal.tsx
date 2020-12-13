import Modal from 'react-modal';
import React, { FC } from 'react';

export interface VictoryModalProps extends Modal.Props {
  image: string;
}

export const VictoryModal: FC<VictoryModalProps> = props => {
  const { isOpen, image, onRequestClose } = props;

  return (
    <Modal
      isOpen={isOpen}
      className="modal fade-in"
      overlayClassName="modal-overlay"
      onRequestClose={onRequestClose}
    >
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Victory!</div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" onClick={onRequestClose} />
          </div>
        </div>
        <div className="window-body">
          <div className="row">
            <img src={image} className="m-auto" alt="You are amazing!" />
          </div>
          <div className="controls mt-10">
            <button type="button" onClick={onRequestClose}>
              Yahooo!
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
