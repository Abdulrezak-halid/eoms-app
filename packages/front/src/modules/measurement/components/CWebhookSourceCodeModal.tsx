import { useCallback, useMemo, useState } from "react";
import { Check, Copy, X } from "lucide-react";

import { generateRequestPostPath } from "@m/base/api/Api";
import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CMessageCard } from "@m/core/components/CMessageCard";
import { CModal } from "@m/core/components/CModal";
import { CMutedText } from "@m/core/components/CMutedText";
import {
  CSyntaxHighlighter,
  ISyntaxHighligterLanguage,
} from "@m/core/components/CSyntaxHighlighter";
import { CTab, ITabListValueItem } from "@m/core/components/CTab";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDtoInboundIntegrationListItem } from "@m/measurement/interfaces/IDtoInboundIntegration";

interface IExampleModalProps {
  onClose: () => void;
  record: IDtoInboundIntegrationListItem;
}

interface ICodeExample {
  highlightLanguage: ISyntaxHighligterLanguage;
  code: string;
}

export function CWebhookSourceCodeModal({
  onClose,
  record,
}: IExampleModalProps) {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("shell");
  const [copied, setCopied] = useState(false);

  const hookUrl = useMemo(() => {
    const hookPath = generateRequestPostPath("/a/metric/hooks/{id}", {
      path: { id: record.id },
    });
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    return `${baseUrl}${hookPath}`;
  }, [record.id]);

  const codeExamples = useMemo((): Record<string, ICodeExample> => {
    const isoDate = new Date().toISOString();

    return {
      shell: {
        highlightLanguage: "bash",
        code: `curl ${hookUrl} \\
  -H "X-Token: $ACCESS_TOKEN" \\
  -H 'Content-Type: application/json' \\
  -d '{
    "records": [{
      "value": 20,
      "datetime": "${isoDate}"
    }]
  }'`,
      },
      javascript: {
        highlightLanguage: "typescript",
        code: `fetch('${hookUrl}', {
  method: 'POST',
  headers: {
    'X-Token': process.env.ACCESS_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    records: [{
      value: 20,
      datetime: '${isoDate}'
    }]
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
      },
      python: {
        highlightLanguage: "python",
        code: `import requests
import os

url = '${hookUrl}'
headers = {
    'X-Token': os.environ.get('ACCESS_TOKEN'),
    'Content-Type': 'application/json'
}
data = {
    'records': [{
        'value': 20,
        'datetime': '${isoDate}'
    }]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
      },
      php: {
        highlightLanguage: "php",
        code: `<?php
$url = '${hookUrl}';

$data = [
    'records' => [[
        'value' => 20,
        'datetime' => '${isoDate}'
    ]]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Token: ' . getenv('ACCESS_TOKEN'),
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>`,
      },
    };
  }, [hookUrl]);

  const languageTabs = useMemo<ITabListValueItem[]>(
    () => [
      { value: "shell", label: "Shell (curl)" },
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "php", label: "PHP" },
    ],
    [],
  );

  const handleCopyCode = useCallback(() => {
    if (
      navigator.clipboard &&
      navigator.clipboard.writeText &&
      codeExamples[selectedLanguage]
    ) {
      void navigator.clipboard
        .writeText(codeExamples[selectedLanguage].code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }, [codeExamples, selectedLanguage]);

  const handleTabChange = useCallback((key: string) => {
    setSelectedLanguage(key);
    setCopied(false);
  }, []);

  return (
    <CModal onClickBg={onClose} lg>
      <div className="min-w-0">
        <div className="p-2 rounded-lg">
          <CLine className="justify-between mb-4">
            <div className="font-bold text-lg truncate pr-2">
              {t("apiCodeExample")}
            </div>
            <CButton
              icon={X}
              onClick={onClose}
              tertiary
              className="flex-shrink-0"
            />
          </CLine>

          <div className="space-y-4">
            <div className="">
              <CMutedText>{t("endpointUrl")}</CMutedText>
              <code className="break-all block mt-1">{hookUrl}</code>
            </div>

            <CTab
              list={languageTabs}
              value={selectedLanguage}
              onChange={handleTabChange}
            />

            <div className="relative">
              <div className="absolute top-0 right-0 z-10">
                <CButton
                  icon={copied ? Check : Copy}
                  onClick={handleCopyCode}
                  className="!p-1.5 @sm:!p-2"
                />
              </div>

              <CSyntaxHighlighter
                code={codeExamples[selectedLanguage].code}
                language={codeExamples[selectedLanguage].highlightLanguage}
                hideLineNumbers
              />
            </div>

            <CMessageCard
              type="info"
              message={t("msgAccessTokenInfo")}
              goLabel={t("accessTokens")}
              goPath="/configuration/access-token"
            />
          </div>
        </div>
      </div>
    </CModal>
  );
}
