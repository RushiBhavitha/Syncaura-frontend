import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";

const languageNames = {
  en: 'English', es: 'Español', fr: 'Français',
  de: 'Deutsch', hi: 'हिंदी', zh: '中文', ja: '日本語'
};

const Profile = () => {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState({
    firstName: false, lastName: false, email: false, phone: false, language: false
  });

  const [formData, setFormData] = useState({
    firstName: 'John', lastName: 'Doe', email: 'JohnDoe@gmail.com', phone: '0000000000',
    language: (localStorage.getItem("app_language") || 'en').substring(0, 2)
  });

  const [currentLanguageDisplay, setCurrentLanguageDisplay] = useState(
    (i18n.language || localStorage.getItem("app_language") || 'en').substring(0, 2)
  );

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      const clean = lng.substring(0, 2);
      setCurrentLanguageDisplay(clean);
      setFormData(prev => ({ ...prev, language: clean }));
    };
    const handleCustomEvent = (e) => {
      const clean = e.detail.language.substring(0, 2);
      setCurrentLanguageDisplay(clean);
      setFormData(prev => ({ ...prev, language: clean }));
    };
    i18n.on('languageChanged', handleLanguageChange);
    window.addEventListener('languageChange', handleCustomEvent);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      window.removeEventListener('languageChange', handleCustomEvent);
    };
  }, []);

  const handleEdit = (field) => setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = (field) => {
    if (field === "language") {
      // i18n.changeLanguage already handles localStorage persistence
      // and dispatches the languageChange event internally
      i18n.changeLanguage(formData.language);
    }
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const fieldRow = (field, type = "text") => (
    <div className="flex items-center gap-[28px]">
      <label className="w-[120px] text-[16px] font-normal text-black dark:text-white text-left">{t(field)}</label>
      <input type={type} value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} disabled={!isEditing[field]}
        className="w-[385px] h-[54px] px-5 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-base text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]" />
      <button onClick={() => isEditing[field] ? handleSave(field) : handleEdit(field)}
        className="w-[72px] py-1 rounded-full bg-[#2461E6] text-white text-sm">
        {isEditing[field] ? t('save') : t('edit')}
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{t('profile')}</h2>
        <p className="text-sm text-black dark:text-gray-400 mb-7">{t('manageProfileSettings')}</p>
      </div>

      <div className="w-full max-w-[700px] mx-auto">
        <div className="flex flex-col items-center gap-[28px]">
          {fieldRow('firstName')}
          {fieldRow('lastName')}
          {fieldRow('email', 'email')}
          {fieldRow('phone', 'tel')}

          {/* Language - with Edit/Save button and dropdown when editing */}
          <div className="flex items-center gap-[28px]">
            <label className="w-[120px] text-[16px] font-normal text-black dark:text-white text-left">
              {t('language')}
            </label>

            {isEditing.language ? (
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-[385px] h-[54px] px-5 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-base text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]"
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={languageNames[currentLanguageDisplay] || 'English'}
                disabled
                className="w-[385px] h-[54px] px-5 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-base text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]"
              />
            )}

            <button
              onClick={() => isEditing.language ? handleSave('language') : handleEdit('language')}
              className="w-[72px] py-1 rounded-full bg-[#2461E6] text-white text-sm"
            >
              {isEditing.language ? t('save') : t('edit')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;