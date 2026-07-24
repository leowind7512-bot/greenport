// ponytail: 이 함수 하나의 역할은 딱 하나 — 브라우저가 CORS 때문에 직접 못 부르는
// 스마트팜코리아 혁신밸리 Open API를 서버 쪽에서 대신 불러서 필요한 값만 추려 돌려주는 것.
// 서비스키는 여기(서버)에만 있고 브라우저로는 절대 내려가지 않는다.
const BASE = "https://www.smartfarmkorea.net/Agree_WS/webservices/InnovationValleyRestService/getEnvDataList";

exports.handler = async (event) => {
  const { facilityId, date } = event.queryStringParameters || {};
  const serviceKey = process.env.SMARTFARM_API_KEY;

  if (!facilityId || !date) {
    return json(400, { error: "facilityId, date 파라미터가 필요합니다." });
  }
  if (!serviceKey) {
    return json(500, { error: "서버에 SMARTFARM_API_KEY 환경변수가 설정되어 있지 않습니다." });
  }

  const yyyymmdd = date.replace(/-/g, "");
  const url = `${BASE}/${serviceKey}/${facilityId}/${yyyymmdd}`;

  let rows;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    rows = await res.json();
  } catch (e) {
    return json(502, { error: `혁신밸리 API 호출 실패: ${e.message}` });
  }

  if (!Array.isArray(rows) || rows.length === 0 || rows[0].statusCode === "30") {
    return json(200, { available: false, reason: "invalid_key_or_facility" });
  }

  const nums = code => rows.filter(r => r.fatrCode === code).map(r => Number(r.senVal)).filter(Number.isFinite);
  const temps = nums("TI");
  const humids = nums("HI");

  if (!temps.length || !humids.length) {
    return json(200, { available: false, reason: "no_env_data_for_date" });
  }

  return json(200, {
    available: true,
    tempMin: Math.min(...temps),
    tempMax: Math.max(...temps),
    humidityMin: Math.min(...humids),
    humidityMax: Math.max(...humids),
    sampleCount: rows.length,
    facilityId,
    measDate: date,
    source: "스마트팜코리아 혁신밸리 Open API",
  });
};

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
