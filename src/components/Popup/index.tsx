import { Drawer, DrawerProps, Grid, Modal, ModalProps } from 'antd';
import React, { ReactNode, useEffect } from 'react';
import './custom.css';

const { useBreakpoint } = Grid;

interface ResponsivePopupProps {
  visible: boolean;
  onClose: () => void;
  drawerTitle?: ReactNode;
  modalTitle?: ReactNode;
  children: ReactNode;
  modalProps?: Omit<ModalProps, 'open' | 'onCancel' | 'title'>;
  drawerProps?: Omit<DrawerProps, 'open' | 'onClose' | 'title' | 'placement'>;
}

const ResponsivePopup: React.FC<ResponsivePopupProps> = ({
  visible,
  onClose,
  drawerTitle,
  modalTitle,
  children,
  modalProps = {},
  drawerProps = {},
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    if (visible) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, [visible]);

  if (isMobile) {
    return (
      <Drawer
        open={visible}
        onClose={onClose}
        className="custom-allkons custom-drawer"
        title={drawerTitle}
        closable={false}
        placement="bottom"
        height="auto"
        maskClosable={false}
        mask={true}
        {...drawerProps}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={modalTitle}
      footer={null}
      centered
      className="custom-allkons custom-modal"
      {...modalProps}
    >
      {children}
    </Modal>
  );
};

export default ResponsivePopup;
