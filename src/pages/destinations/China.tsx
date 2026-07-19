import DestinationSteps from "../../components/DestinationSteps";
import { CHINA_UNIVERSITIES } from "../../data/universities";
import { useLang } from "../../i18n";

export default function China() {
  const { t } = useLang();
  return (
    <DestinationSteps
      country={t.china.country}
      code="PEK"
      intro={t.china.intro}
      steps={t.china.steps}
      partnerUniversities={CHINA_UNIVERSITIES}
    />
  );
}
