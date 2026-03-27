const { GoogleGenerativeAI } = require("@google/generative-ai");

// 사용자님이 알려주신 API 키
const apiKey = "AIzaSyDtE92Lewj3EqohZT2JIs-_FuQ5k5H7Yz0"; 

async function checkModels() {
  console.log("---------------------------------------------------");
  console.log("🔍 API 키 검증 및 모델 확인 중...");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 테스트해볼 모델 이름들
  const candidates = [
      "gemini-1.5-flash",
      "gemini-1.5-pro", 
      "gemini-1.0-pro", 
      "gemini-pro"
  ];

  let success = false;

  for (const modelName of candidates) {
      try {
          console.log(`Testing: ${modelName}...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent("Hello");
          const response = await result.response;
          console.log(`✅ 성공! 사용 가능한 모델: "${modelName}"`);
          success = true;
          break; // 성공하면 중단
      } catch (e) {
          console.log(`❌ 실패: ${modelName} (${e.status || 'Error'})`);
      }
  }
  
  if (!success) {
      console.log("⚠️ 모든 모델 테스트 실패. API Key가 올바르지 않거나 권한이 없습니다.");
  }
  console.log("---------------------------------------------------");
}

checkModels();