import React from 'react';
import { useTranslation } from 'react-i18next';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t('navigation.profile')}</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Trang hồ sơ đang được phát triển...
        </p>
      </div>
    </div>
  );
};
