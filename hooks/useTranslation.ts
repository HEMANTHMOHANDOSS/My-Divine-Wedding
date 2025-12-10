
import { useLanguage } from '../contexts/LanguageContext';

const useTranslation = () => {
  const { t, language, setLanguage } = useLanguage();
  return { t, language, setLanguage };
};

export default useTranslation;
