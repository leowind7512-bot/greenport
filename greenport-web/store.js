// ponytail: index.html(고객)과 farmer.html(농가)이 같은 상품/주문 데이터를 보고 써야 해서
// 데모 백엔드 대신 localStorage를 공유 저장소로 사용한다. 실서비스에서는 이 파일 전체가 API 호출로 교체된다.
const GP_KEY_PRODUCTS = "greenport_products";
const GP_KEY_ORDERS = "greenport_orders";
const GP_KEY_EMPLOYEES = "greenport_employees";
const GP_KEY_FARMS = "greenport_farms";

const GP_SEED_FARMS = [
  { id: "F1", name: "밀양 A농원", region: "경상남도 밀양시", measured: true, active: true, certified: false, certNote: "", commissionRate: 0.12 },
  { id: "F2", name: "밀양 B농원", region: "경상남도 밀양시", measured: true, active: true, certified: false, certNote: "", commissionRate: 0.12 },
  { id: "F3", name: "청정 D농원", region: "충청남도 논산시", measured: false, active: true, certified: false, certNote: "", commissionRate: 0.15 },
];

const GP_SEED_EMPLOYEES = [
  { id: "E1", name: "김민우", dept: "개발본부 서비스개발팀", limit: 50000 },
  { id: "E2", name: "이지영", dept: "경영기획실 인사팀", limit: 50000 },
  { id: "E3", name: "박준현", dept: "스마트엔지니어링팀", limit: 50000 },
  { id: "E4", name: "최서아", dept: "마케팅전략본부", limit: 50000 },
  { id: "E5", name: "정우진", dept: "품질보증팀", limit: 50000 },
];

// ponytail: 밀양 A/B농원 상품은 스마트팜코리아 혁신밸리 Open API(실제 서비스키로 조회)로 확인한
// 밀양 혁신밸리의 실제 재배 품목(딸기·토마토·파프리카 중심, 사과/배 재배 시설 없음)에 맞춰 구성했다.
// water/soil/carbon(절감량)은 이 API에 원천 데이터가 없어 여전히 업계 평균 추정치이며,
// realStats 필드만 밀양 혁신밸리 실측 환경·생육 데이터(2026-03-15 조회)를 그대로 반영한 진짜 값이다.
const GP_SEED_PRODUCTS = [
  { id: 1, name: "밀양 스마트팜 딸기 1kg", emoji: "🍓", farm: "밀양 A농원", region: "경상남도 밀양시", category: "과일", price: 22000, measured: true, water: 80, soil: 1.0, carbon: 110, badge: { text: "인기", type: "hot" }, stock: 20,
    rating: 4.8, reviews: 145,
    desc: "밀양 혁신밸리 임대형 스마트팜에서 실시간 환경 데이터로 관리하며 키운 프리미엄 딸기입니다. 당도와 향이 진한 품종을 엄선했습니다.",
    detail: ["재배면적 1,293평 임대형 스마트팜(2024년 9월 정식)", "생육기간 내부온도 12.5~24℃로 정밀 관리(실측)", "생육 표본 400건 기준 최대 과중 29.6g(실측)", "노지재배 대비 절감 효과는 업계 평균 추정치 적용"],
    gallery: [{ emoji: "🍓", caption: "대표 이미지" }, { emoji: "📦", caption: "패키지 구성" }, { emoji: "🌡️", caption: "환경 모니터링" }],
    realStats: { tempMin: 12.5, tempMax: 24, humidityMin: 35.7, humidityMax: 89.3, note: "최대 과중 29.6g · 실측 표본 400건", source: "스마트팜코리아 혁신밸리 Open API", facilityId: "C010904_02_05", measDate: "2026-03-15" } },
  { id: 2, name: "밀양 대추방울토마토 1kg", emoji: "🍅", farm: "밀양 B농원", region: "경상남도 밀양시", category: "채소", price: 13000, measured: true, water: 70, soil: 0.9, carbon: 100, badge: { text: "마감임박", type: "urgent" }, stock: 6,
    rating: 4.7, reviews: 98,
    desc: "밀양 혁신밸리 스마트팜에서 재배한 대추방울토마토입니다. 정밀 환경 제어로 당도와 착과가 균일합니다.",
    detail: ["재배면적 261평 스마트팜(2024년 10월 정식)", "생육기간 내부온도 13.3~31.6℃로 관리(실측)", "습도 61.2~95.8% 범위 유지(실측)", "노지재배 대비 절감 효과는 업계 평균 추정치 적용"],
    gallery: [{ emoji: "🍅", caption: "대표 이미지" }, { emoji: "📦", caption: "패키지 구성" }, { emoji: "🌡️", caption: "환경 모니터링" }],
    realStats: { tempMin: 13.3, tempMax: 31.6, humidityMin: 61.2, humidityMax: 95.8, note: "재배면적 261평", source: "스마트팜코리아 혁신밸리 Open API", facilityId: "C010904_02_02", measDate: "2026-03-15" } },
  { id: 3, name: "밀양 컬러 파프리카 3입", emoji: "🫑", farm: "밀양 B농원", region: "경상남도 밀양시", category: "채소", price: 9000, measured: true, water: 55, soil: 0.7, carbon: 85, badge: { text: "신상품", type: "new" }, stock: 25,
    rating: 4.5, reviews: 22,
    desc: "밀양 혁신밸리 경영형 스마트팜의 신상품 컬러 파프리카입니다. 아삭한 식감과 선명한 색이 특징입니다.",
    detail: ["경영형 스마트팜 재배(2024년 8월 정식)", "생육기간 내부온도 18.1~28℃로 관리(실측)", "습도 67~93.2% 범위 유지(실측)", "노지재배 대비 절감 효과는 업계 평균 추정치 적용"],
    gallery: [{ emoji: "🫑", caption: "대표 이미지" }, { emoji: "📦", caption: "패키지 구성" }],
    realStats: { tempMin: 18.1, tempMax: 28, humidityMin: 67, humidityMax: 93.2, note: "경영형 스마트팜", source: "스마트팜코리아 혁신밸리 Open API", facilityId: "C010904_04_05", measDate: "2026-03-15" } },
  { id: 4, name: "시금치 1kg", emoji: "🥬", farm: "청정 D농원", region: "충청남도 논산시", category: "채소", price: 9000, measured: false, water: 40, soil: 0.5, carbon: 60, stock: 30,
    rating: 4.5, reviews: 37,
    desc: "부드럽고 향이 진한 시금치입니다. 계측 인프라 도입 예정 농가로 절감 수치는 업계 평균 추정치입니다.",
    detail: ["세척 후 소분 포장, 1kg", "냉장 보관 시 약 5일 신선 유지", "국거리·나물용으로 적합", "절감 지표는 업계 평균 추정치(계측기 미보유)"],
    gallery: [{ emoji: "🥬", caption: "대표 이미지" }, { emoji: "📦", caption: "패키지 구성" }] },
  { id: 5, name: "감귤 3kg", emoji: "🍊", farm: "청정 D농원", region: "충청남도 논산시", category: "과일", price: 18000, measured: false, water: 90, soil: 1.1, carbon: 130, stock: 50,
    rating: 4.4, reviews: 12,
    desc: "새콤달콤 상큼한 감귤입니다.",
    detail: ["당도 11brix 내외 선별", "통풍 포장 3kg(약 20과)", "서늘한 곳 보관 시 약 2주 신선 유지", "절감 지표는 업계 평균 추정치(계측기 미보유)"],
    gallery: [{ emoji: "🍊", caption: "대표 이미지" }, { emoji: "📦", caption: "패키지 구성" }] },
];

function gpWon(n) { return n.toLocaleString("ko-KR") + "원"; }

function gpGetProducts() {
  const raw = localStorage.getItem(GP_KEY_PRODUCTS);
  if (raw) return JSON.parse(raw);
  gpSaveProducts(GP_SEED_PRODUCTS);
  return JSON.parse(JSON.stringify(GP_SEED_PRODUCTS));
}
function gpSaveProducts(products) {
  localStorage.setItem(GP_KEY_PRODUCTS, JSON.stringify(products));
}
function gpNextProductId(products) {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function gpGetOrders() {
  return JSON.parse(localStorage.getItem(GP_KEY_ORDERS) || "[]");
}
function gpAddOrder(order) {
  const orders = gpGetOrders();
  orders.push(order);
  localStorage.setItem(GP_KEY_ORDERS, JSON.stringify(orders));
}
function gpSetItemStatus(orderId, productId, status) {
  const orders = gpGetOrders();
  const order = orders.find(o => o.id === orderId);
  const item = order && order.items.find(it => it.productId === productId);
  if (item) item.status = status;
  localStorage.setItem(GP_KEY_ORDERS, JSON.stringify(orders));
}
function gpSetOrderSettled(orderId, settled) {
  const orders = gpGetOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) order.settled = settled;
  localStorage.setItem(GP_KEY_ORDERS, JSON.stringify(orders));
}

function gpGetEmployees() {
  const raw = localStorage.getItem(GP_KEY_EMPLOYEES);
  if (raw) return JSON.parse(raw);
  gpSaveEmployees(GP_SEED_EMPLOYEES);
  return JSON.parse(JSON.stringify(GP_SEED_EMPLOYEES));
}
function gpSaveEmployees(employees) {
  localStorage.setItem(GP_KEY_EMPLOYEES, JSON.stringify(employees));
}
// 잔여 한도 계산: 이미 회사가 커밋한 환급액(refund) 합계만큼 한도에서 차감한다.
// ponytail: 한도 소진 로직이라 자체 검증 포함
function gpRemainingLimit(employee, orders) {
  const used = orders.filter(o => o.employeeId === employee.id).reduce((sum, o) => sum + o.refund, 0);
  return Math.max(0, employee.limit - used);
}
console.assert(gpRemainingLimit({ id: "X", limit: 50000 }, [{ employeeId: "X", refund: 20000 }, { employeeId: "Y", refund: 99999 }]) === 30000, "gpRemainingLimit: 타직원 주문 혼입 실패");
console.assert(gpRemainingLimit({ id: "X", limit: 50000 }, [{ employeeId: "X", refund: 60000 }]) === 0, "gpRemainingLimit: 음수 방지 실패");

function gpGetFarms() {
  const raw = localStorage.getItem(GP_KEY_FARMS);
  if (raw) return JSON.parse(raw);
  gpSaveFarms(GP_SEED_FARMS);
  return JSON.parse(JSON.stringify(GP_SEED_FARMS));
}
function gpSaveFarms(farms) {
  localStorage.setItem(GP_KEY_FARMS, JSON.stringify(farms));
}
function gpSetItemFarmSettled(orderId, productId, settled) {
  const orders = gpGetOrders();
  const order = orders.find(o => o.id === orderId);
  const item = order && order.items.find(it => it.productId === productId);
  if (item) item.farmSettled = settled;
  localStorage.setItem(GP_KEY_ORDERS, JSON.stringify(orders));
}
// 농가 지급액 = 판매액 - 수수료. 돈 계산이라 자체 검증 포함
function gpFarmPayout(saleAmount, commissionRate) {
  const commission = Math.round(saleAmount * commissionRate);
  return { commission, payout: saleAmount - commission };
}
console.assert(JSON.stringify(gpFarmPayout(100000, 0.12)) === JSON.stringify({ commission: 12000, payout: 88000 }), "gpFarmPayout: 수수료 계산 실패");
