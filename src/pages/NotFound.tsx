
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">{t('error')}</p>
        <p className="mb-6 text-muted-foreground">
          {t('somethingWentWrong')}
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/">{t('dashboard')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/packages">{t('packages')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
